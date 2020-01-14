/**
 * @File Name		: ReceivebillItem.java
 * @Package   	: com.fanglin.finance.bean
 * @Version		: 1.0
 * @Date			: 2019-12-31
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.bean;

import java.io.Serializable;

public class ReceivebillItem implements Serializable {

	private static final long serialVersionUID = -633604605020333069L;

	private Long FEntryID;

	private SettleType FSETTLETYPEID;

	private Organization FPURPOSEID;

	private String FRECTOTALAMOUNTFOR;

	private String FRECAMOUNTFOR_E;

	private String FRECAMOUNT_E;

	private String FSETTLEDISTAMOUNTFOR;

	private String FHANDLINGCHARGEFOR;

	private String FOVERUNDERAMOUNTFOR;

	private Organization FACCOUNTID;

	private String FOPPOSITEBANKACCOUNT;

	private String FOPPOSITECCOUNTNAME;

	private String FOPPOSITEBANKNAME;

	private String FSETTLENO;

	private String FCOMMENT;

	public ReceivebillItem() {
		super();
	}

	public Long getFEntryID() {
		return FEntryID;
	}

	public void setFEntryID(Long fEntryID) {
		FEntryID = fEntryID;
	}

	public SettleType getFSETTLETYPEID() {
		return FSETTLETYPEID;
	}

	public void setFSETTLETYPEID(SettleType fSETTLETYPEID) {
		FSETTLETYPEID = fSETTLETYPEID;
	}

	public Organization getFPURPOSEID() {
		return FPURPOSEID;
	}

	public void setFPURPOSEID(Organization fPURPOSEID) {
		FPURPOSEID = fPURPOSEID;
	}

	public String getFRECTOTALAMOUNTFOR() {
		return FRECTOTALAMOUNTFOR;
	}

	public void setFRECTOTALAMOUNTFOR(String fRECTOTALAMOUNTFOR) {
		FRECTOTALAMOUNTFOR = fRECTOTALAMOUNTFOR;
	}

	public String getFRECAMOUNTFOR_E() {
		return FRECAMOUNTFOR_E;
	}

	public void setFRECAMOUNTFOR_E(String fRECAMOUNTFOR_E) {
		FRECAMOUNTFOR_E = fRECAMOUNTFOR_E;
	}

	public String getFRECAMOUNT_E() {
		return FRECAMOUNT_E;
	}

	public void setFRECAMOUNT_E(String fRECAMOUNT_E) {
		FRECAMOUNT_E = fRECAMOUNT_E;
	}

	public String getFSETTLEDISTAMOUNTFOR() {
		return FSETTLEDISTAMOUNTFOR;
	}

	public void setFSETTLEDISTAMOUNTFOR(String fSETTLEDISTAMOUNTFOR) {
		FSETTLEDISTAMOUNTFOR = fSETTLEDISTAMOUNTFOR;
	}

	public String getFHANDLINGCHARGEFOR() {
		return FHANDLINGCHARGEFOR;
	}

	public void setFHANDLINGCHARGEFOR(String fHANDLINGCHARGEFOR) {
		FHANDLINGCHARGEFOR = fHANDLINGCHARGEFOR;
	}

	public String getFOVERUNDERAMOUNTFOR() {
		return FOVERUNDERAMOUNTFOR;
	}

	public void setFOVERUNDERAMOUNTFOR(String fOVERUNDERAMOUNTFOR) {
		FOVERUNDERAMOUNTFOR = fOVERUNDERAMOUNTFOR;
	}

	public Organization getFACCOUNTID() {
		return FACCOUNTID;
	}

	public void setFACCOUNTID(Organization fACCOUNTID) {
		FACCOUNTID = fACCOUNTID;
	}

	public String getFOPPOSITEBANKACCOUNT() {
		return FOPPOSITEBANKACCOUNT;
	}

	public void setFOPPOSITEBANKACCOUNT(String fOPPOSITEBANKACCOUNT) {
		FOPPOSITEBANKACCOUNT = fOPPOSITEBANKACCOUNT;
	}

	public String getFOPPOSITECCOUNTNAME() {
		return FOPPOSITECCOUNTNAME;
	}

	public void setFOPPOSITECCOUNTNAME(String fOPPOSITECCOUNTNAME) {
		FOPPOSITECCOUNTNAME = fOPPOSITECCOUNTNAME;
	}

	public String getFOPPOSITEBANKNAME() {
		return FOPPOSITEBANKNAME;
	}

	public void setFOPPOSITEBANKNAME(String fOPPOSITEBANKNAME) {
		FOPPOSITEBANKNAME = fOPPOSITEBANKNAME;
	}

	public String getFSETTLENO() {
		return FSETTLENO;
	}

	public void setFSETTLENO(String fSETTLENO) {
		FSETTLENO = fSETTLENO;
	}

	public String getFCOMMENT() {
		return FCOMMENT;
	}

	public void setFCOMMENT(String fCOMMENT) {
		FCOMMENT = fCOMMENT;
	}
}
