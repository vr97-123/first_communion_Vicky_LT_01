import { EventData, Page } from '@nativescript/core';
import { MainViewModel } from './main-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    
    if (!page.bindingContext) {
        page.bindingContext = new MainViewModel();
    }
    
    // Log navigation success
    console.log('Page navigation successful');
}