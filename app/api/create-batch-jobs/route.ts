import { NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';
import { postJobToTelegram, TelegramJobPost } from '@/lib/telegram-bot';
import { generateSlug } from '@/lib/supabase-helpers';

// Helper function to create batch Telegram message
function createBatchTelegramMessage({
  companyName,
  companyLogo,
  sharedFields,
  createdJobs,
  categoryMap
}: {
  companyName: string;
  companyLogo?: string;
  sharedFields: any;
  createdJobs: any[];
  categoryMap: Map<string, string>;
}) {
  console.log('🔍 Checking for fresh graduate positions in batch:', {
    totalJobs: createdJobs.length,
    jobTitles: createdJobs.map(job => job.title),
    jobDescriptions: createdJobs.map(job => job.description?.substring(0, 50))
  });
  
  // Check if any position is for fresh graduates
  const hasFreshGraduates = createdJobs.some(job => {
    const titleLower = job.title ? job.title.toLowerCase() : '';
    const descLower = job.description ? job.description.toLowerCase() : '';
    const reqLower = job.requirements ? job.requirements.toLowerCase() : '';
    
    const isFreshGraduate = 
      titleLower.includes('fresh graduate') ||
      titleLower.includes('fresh graduate') ||
      titleLower.includes('graduate') ||
      titleLower.includes('intern') ||
      titleLower.includes('internship') ||
      titleLower.includes('trainee') ||
      titleLower.includes('entry level') ||
      descLower.includes('fresh graduate') ||
      reqLower.includes('fresh graduate');
    
    console.log(`🔍 Checking job "${job.title}":`, {
      titleLower,
      isFreshGraduate,
      hasFreshGraduateKeyword: titleLower.includes('fresh graduate') || titleLower.includes('intern') || titleLower.includes('graduate')
    });
    
    return isFreshGraduate;
  });
  
  console.log('🎯 Fresh graduate detection result:', {
    hasFreshGraduates,
    headerText: hasFreshGraduates ? "🚨 *NEW JOB OPPORTUNITY* 🚨Fresh  Graduates " : "🚨 *NEW JOB OPPORTUNITY* 🚨"
  });
  
  // Determine header based on fresh graduates detection
  const headerText = hasFreshGraduates ? "🚨 *NEW JOB OPPORTUNITY* 🚨Fresh  Graduates " : "🚨 *NEW JOB OPPORTUNITY* 🚨";
  
  let message = `${headerText}\n\n`;
  message += `🏢 *${companyName}*\n\n`;
  message += `🚀 *Multiple Open Positions*\n\n`;
  
  message += `📋 *Available Positions:*\n\n`;
  
  createdJobs.forEach((job, index) => {
    message += `${index + 1}. *${job.title}*\n`;
    
    // Add brief description if available
    if (job.description && job.description.length > 0) {
      const shortDesc = job.description.length > 60 
        ? job.description.substring(0, 60) + '...' 
        : job.description;
      message += `   📝 ${shortDesc}\n`;
    }
    
    message += '\n';
  });
  
  // Add shared info at the end
  if (sharedFields.deadline) {
    message += `📅 *Deadline:* ${sharedFields.deadline}\n`;
  }
  
  message += `🎯 *Total Positions:* ${createdJobs.length}\n\n`;
  
  message += `👇 *Apply Now* 👇\n\n`;
  message += `▪️ *Find More Details here*\n`;
  message += `🗝 https://faydajobs.com/jobs/${createdJobs[0].slug}\n\n`;
  message += `📱 *Visit Website:* https://faydajobs.com/`;
  
  return message;
}

// Helper function to post batch job to Telegram
async function postBatchJobToTelegram({
  message,
  companyLogo,
  slug
}: {
  message: string;
  companyLogo?: string;
  slug: string;
}): Promise<boolean> {
  const TELEGRAM_CONFIG = {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    channelId: process.env.TELEGRAM_CHANNEL_ID,
  };

  if (!TELEGRAM_CONFIG.botToken || !TELEGRAM_CONFIG.channelId) {
    console.error('❌ Telegram configuration missing');
    return false;
  }

  try {
    const publicJobUrl = `https://faydajobs.com/jobs/${slug}`;
    
    // Create inline keyboard for batch posting
    const inlineKeyboard = {
      inline_keyboard: [
        [
          {
            text: "🚀 Apply Now",
            url: publicJobUrl
          }
        ],
        [
          {
            text: "📱 Visit Website",
            url: "https://faydajobs.com"
          }
        ]
      ]
    };
    
    if (companyLogo) {
      // Send photo with company logo
      const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendPhoto`;
      const payload = {
        chat_id: TELEGRAM_CONFIG.channelId,
        photo: companyLogo,
        caption: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: false,
        reply_markup: inlineKeyboard
      };

      const response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('❌ Telegram photo API error:', data);
        return false;
      }

      console.log('✅ Batch photo sent successfully to Telegram');
      return true;
      
    } else {
      // Send text message with inline buttons
      const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
      const payload = {
        chat_id: TELEGRAM_CONFIG.channelId,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: false,
        reply_markup: inlineKeyboard
      };

      const response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('❌ Telegram text API error:', data);
        return false;
      }

      console.log('✅ Batch text sent successfully to Telegram');
      return true;
    }
    
  } catch (error) {
    console.error('❌ Error sending batch Telegram message:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const batchData = await request.json();
    const { sharedFields, positions } = batchData;
    
    console.log('🚀 Batch job creation started:', { 
      sharedFieldsCount: Object.keys(sharedFields).length,
      positionsCount: positions.length 
    });
    
    // Validate input
    if (!sharedFields || !positions || !Array.isArray(positions)) {
      throw new Error('Invalid batch data structure');
    }
    
    if (positions.length === 0) {
      throw new Error('No positions provided');
    }
    
    const results = {
      createdJobs: [] as any[],
      updatedJobs: [] as any[],
      telegramPosts: [] as any[],
      errors: [] as string[]
    };
    
    // Generate a unique batch ID for this batch creation
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`🆔 Generated batch ID: ${batchId}`);
    
    // Process each position
    for (const position of positions) {
      try {
        // Generate slug for this position
        const slug = generateSlug(position.title);
        console.log(`📝 Generated slug for "${position.title}":`, slug);
        
        // Combine shared fields with position-specific fields
        // Exclude temporary ID from database insertion
        const { id: tempId, ...positionData } = position;
        const jobData = {
          ...sharedFields,
          ...positionData,
          slug,
          job_type: sharedFields.job_type || 'Full-time', // Default if not provided
          batch_id: batchId, // Add batch identifier (same for all positions)
          is_batch_job: true, // Mark as batch job
        };
        
        // Check if this is an update (has valid UUID) or create (no id or temp id)
        if (position.id && typeof position.id === 'string' && !position.id.startsWith('temp-') && position.id.length > 10) {
          // Update existing job (valid UUID)
          console.log(`🔄 Updating existing job: ${position.title}`);
          const { error, data } = await supabase
            .from("jobs")
            .update(jobData)
            .eq('id', position.id)
            .select()
            .single();
            
          if (error) {
            throw error;
          }
          
          results.updatedJobs.push(data);
          console.log(`✅ Job updated successfully: ${position.title}`);
          
        } else {
          // Create new job
          console.log(`➕ Creating new job: ${position.title}`);
          const { error, data } = await supabase
            .from("jobs")
            .insert([jobData])
            .select()
            .single();
            
          if (error) {
            throw error;
          }
          
          results.createdJobs.push(data);
          console.log(`✅ Job created successfully: ${position.title}`);
          
          // Store job data for batch Telegram posting (don't post individually)
          // We'll post all new jobs together after the loop
        }
        
      } catch (error) {
        console.error(`❌ Error processing position "${position.title}":`, error);
        results.errors.push(
          `Failed to process "${position.title}": ${error instanceof Error ? error.message : 'Unknown error'}`
        );
        // Continue processing other positions instead of stopping the entire batch
        continue;
      }
    }
    
    // Post all new jobs to Telegram in a single message
    if (results.createdJobs.length > 0) {
      try {
        console.log(`📤 Posting ${results.createdJobs.length} new jobs to Telegram in a single message...`);
        
        // Get company and category names for all positions
        let companyName = undefined;
        let companyLogo = undefined;
        
        if (sharedFields.company_id) {
          const { data: companyData } = await supabase
            .from("companies")
            .select("name, logo_url")
            .eq("id", sharedFields.company_id)
            .single();
          
          if (companyData) {
            companyName = companyData.name;
            companyLogo = companyData.logo_url;
          }
        }
        
        // Get category names for all positions
        const categoryIds = results.createdJobs.map(job => job.category_id).filter(Boolean);
        const { data: categoriesData } = await supabase
          .from("categories")
          .select("id, name")
          .in("id", categoryIds);
        
        const categoryMap = new Map();
        categoriesData?.forEach(cat => {
          categoryMap.set(cat.id, cat.name);
        });
        
        // Create consolidated Telegram message
        const telegramMessage = createBatchTelegramMessage({
          companyName: companyName || 'Unknown Company',
          companyLogo: companyLogo || undefined,
          sharedFields,
          createdJobs: results.createdJobs,
          categoryMap
        });
        
        // Generate a slug for the batch post (use first job's slug)
        const primarySlug = results.createdJobs[0].slug || undefined;
        
        // Post to Telegram
        const telegramResult = await postBatchJobToTelegram({
          message: telegramMessage,
          companyLogo: companyLogo || undefined,
          slug: primarySlug
        });
        
        if (telegramResult) {
          results.telegramPosts.push({
            jobTitle: `Batch: ${results.createdJobs.length} positions`,
            success: true,
            slug: primarySlug
          });
          console.log(`✅ Batch Telegram post successful for ${results.createdJobs.length} positions`);
        } else {
          results.telegramPosts.push({
            jobTitle: `Batch: ${results.createdJobs.length} positions`,
            success: false,
            error: 'Telegram posting failed'
          });
          console.log(`❌ Batch Telegram post failed for ${results.createdJobs.length} positions`);
        }
        
      } catch (telegramError) {
        console.error(`❌ Batch Telegram error:`, telegramError);
        results.telegramPosts.push({
          jobTitle: `Batch: ${results.createdJobs.length} positions`,
          success: false,
          error: telegramError instanceof Error ? telegramError.message : 'Unknown error'
        });
      }
    }
    
    console.log('🎉 Batch job creation completed:', {
      created: results.createdJobs.length,
      updated: results.updatedJobs.length,
      telegramPosts: results.telegramPosts.length,
      errors: results.errors.length
    });
    
    return NextResponse.json({
      success: true,
      message: `Batch processing completed: ${results.createdJobs.length} created, ${results.updatedJobs.length} updated`,
      ...results
    });
    
  } catch (error) {
    console.error('❌ Batch job creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}
