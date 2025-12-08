import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type TableName = 'books' | 'reviews' | 'categories';
type EventType = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface RealtimeOptions {
  table: TableName;
  event?: EventType;
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
}

export function useRealtimeSubscription(options: RealtimeOptions) {
  const queryClient = useQueryClient();
  const { table, event = '*', filter, onInsert, onUpdate, onDelete } = options;

  useEffect(() => {
    const channelName = `realtime-${table}-${Date.now()}`;
    
    const channelConfig: {
      event: EventType;
      schema: string;
      table: string;
      filter?: string;
    } = {
      event,
      schema: 'public',
      table,
    };

    if (filter) {
      channelConfig.filter = filter;
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes' as any,
        channelConfig,
        (payload: any) => {
          console.log(`[Realtime] ${table} ${payload.eventType}:`, payload);

          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(payload.new);
              queryClient.invalidateQueries({ queryKey: [table] });
              break;
            case 'UPDATE':
              onUpdate?.(payload.new);
              queryClient.invalidateQueries({ queryKey: [table] });
              break;
            case 'DELETE':
              onDelete?.(payload.old);
              queryClient.invalidateQueries({ queryKey: [table] });
              break;
          }
        }
      )
      .subscribe((status) => {
        console.log(`[Realtime] ${table} subscription status:`, status);
      });

    return () => {
      console.log(`[Realtime] Unsubscribing from ${table}`);
      supabase.removeChannel(channel);
    };
  }, [table, event, filter, onInsert, onUpdate, onDelete, queryClient]);
}

export function useRealtimeBooks(onNewBook?: (book: any) => void) {
  useRealtimeSubscription({
    table: 'books',
    event: '*',
    onInsert: onNewBook,
  });
}

export function useRealtimeReviews(bookId?: string) {
  const filter = bookId ? `book_id=eq.${bookId}` : undefined;
  
  useRealtimeSubscription({
    table: 'reviews',
    event: '*',
    filter,
  });
}
