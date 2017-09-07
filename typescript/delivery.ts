/**
 *  
 *  delivery.ts
 *  
 *  Copyleft 2016 Maarten De Schrijver
 *  <maarten de schrijver in the gmail domain dot com>
 *  
 *  
 */

export class BdmAuction {
  
  constructor(
    public auctionName: string,
    public OGM: string
  ) {
      // Trim the title
      this.auctionName = auctionName.trim();
      // Remove (replace with '') all non-numeric characters from OGM-string
      this.OGM = OGM.replace(/\D/g,'');
    }
  
}

export class BdmUser {
  
  constructor(
    public firstName: string,
    public lastName: string,
    public company?: string,
    public emailAddress: string,
    public street: string,
    public houseNumber: number,
    public houseNumberAdd?: string,
    public postalCode: string,
    public locality: string,
    public country: string,
    public residenceType: string,
  ) {
      // Trim all values
      this.firstName        = firstName.trim();
      this.lastName         = lastName.trim();
      this.company          = company.trim();
      this.emailAddress     = emailAddress.trim();
      this.street           = street.trim();
      this.houseNumber      = houseNumber.trim();
      this.houseNumberAdd   = houseNumberAdd.trim();
      this.postalCode       = postalCode.trim();
      this.locality         = locality.trim();
      this.country          = country;
      this.residenceType    = residenceType.trim();
    }
  
}

export class BdmDeliveryRequest {

  constructor(
    public auctions: Object[] = [];,
    public user: BdmUser,
    public extraInfo: string
  ) {  }

}
