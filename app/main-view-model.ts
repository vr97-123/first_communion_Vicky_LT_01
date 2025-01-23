import { Observable, Utils, Dialogs, isAndroid, isIOS } from '@nativescript/core';
import { Geolocation } from '@nativescript/geolocation';
import { SocialShare } from '@nativescript/social-share';

export class MainViewModel extends Observable {
  constructor() {
    super();
  }

  async onCeremonyLocation() {
    const address = "Our Lady Help of Christians Church, 127 Mottingham Road, London SE9 4ST";
    this.openMaps(address);
  }

  async onReceptionLocation() {
    const address = "London DA14 6NZ";
    this.openMaps(address);
  }

  async onRSVP() {
    const phoneNumber = "+447913099011";
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
    
    const canOpen = await Utils.openUrl(whatsappUrl);
    if (!canOpen) {
      Dialogs.alert({
        title: "WhatsApp Not Found",
        message: "Please install WhatsApp to RSVP",
        okButtonText: "OK"
      });
    }
  }

  async onViber() {
    try {
      const phoneNumber = "447913099011"; // Remove the '+' for Viber
      let viberUrl: string;
      
      if (isAndroid) {
        // Android uses a different format
        viberUrl = `viber://add?number=${phoneNumber}`;
      } else {
        // iOS format
        viberUrl = `viber://chat?number=${phoneNumber}`;
      }
      
      const canOpen = await Utils.openUrl(viberUrl);
      if (!canOpen) {
        // If Viber can't be opened, show store link
        const storeUrl = isAndroid 
          ? 'market://details?id=com.viber.voip'
          : 'itms-apps://itunes.apple.com/app/viber-messenger/id382617920';
          
        await Dialogs.confirm({
          title: "Viber Not Found",
          message: "Would you like to install Viber to RSVP?",
          okButtonText: "Install",
          cancelButtonText: "Cancel"
        }).then(async (result) => {
          if (result) {
            const storeCanOpen = await Utils.openUrl(storeUrl);
            if (!storeCanOpen) {
              Dialogs.alert({
                title: "Error",
                message: "Unable to open app store. Please install Viber manually.",
                okButtonText: "OK"
              });
            }
          }
        });
      }
    } catch (error) {
      console.error('Error opening Viber:', error);
      Dialogs.alert({
        title: "Error",
        message: "An error occurred while trying to open Viber",
        okButtonText: "OK"
      });
    }
  }

  async onSharePhotos() {
    const driveUrl = "https://drive.google.com/drive/folders/1dRrZtPtWoBYCu4cBy8A5RNcXss1CIIp5?usp=sharing";
    const canOpen = await Utils.openUrl(driveUrl);
    if (!canOpen) {
      Dialogs.alert({
        title: "Error",
        message: "Unable to open Google Drive folder",
        okButtonText: "OK"
      });
    }
  }

  private async openMaps(address: string) {
    try {
      const encodedAddress = encodeURIComponent(address);
      let mapUrl = '';

      if (isAndroid) {
        // Try Google Maps on Android
        mapUrl = `geo:0,0?q=${encodedAddress}`;
      } else if (isIOS) {
        // Use Apple Maps on iOS
        mapUrl = `maps://?address=${encodedAddress}`;
      }

      const canOpen = await Utils.openUrl(mapUrl);
      if (!canOpen) {
        // Fallback to web URL if native maps fail
        const webUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        const canOpenWeb = await Utils.openUrl(webUrl);
        
        if (!canOpenWeb) {
          Dialogs.alert({
            title: "Error",
            message: "Unable to open maps application",
            okButtonText: "OK"
          });
        }
      }
    } catch (error) {
      console.error('Error opening maps:', error);
      Dialogs.alert({
        title: "Error",
        message: "An error occurred while trying to open maps",
        okButtonText: "OK"
      });
    }
  }
}