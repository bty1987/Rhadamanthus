/**
 * @File Name		: QuotationVO
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import com.fanglin.communion.vo.ContractVO;
import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.personel.vo.UserBaseVO;

public class DecorationContractVO implements Serializable {

	private static final long serialVersionUID = -6225111181876631L;
	
	private Long dcid;
	
	private String orderId;
	
	private ContractVO contract;
	
	private String download;
	
	private String viewpdf;
	
	private UserBaseVO creater;
	
	private Timestamp createTime;
	
	private Short status;
	
	private Long netperfor;
	
	private Long comperfor;
	
	private List<DecorationPaymentVO> payments;
	
	private List<Integer> paymentRates;
	
	public DecorationContractVO(){
		super();
	}
	
	public DecorationContractVO(ContractVO contract, UserBaseVO creater){
		super();
		this.contract = contract;
		this.creater = creater;
	}

	public Long getDcid() {
		return dcid;
	}

	public void setDcid(Long dcid) {
		this.dcid = dcid;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public ContractVO getContract() {
		return contract;
	}

	public void setContract(ContractVO contract) {
		this.contract = contract;
	}

	public String getDownload() {
		return download;
	}

	public void setDownload(String download) {
		this.download = download;
	}

	public String getViewpdf() {
		return viewpdf;
	}

	public void setViewpdf(String viewpdf) {
		this.viewpdf = viewpdf;
	}

	public UserBaseVO getCreater() {
		return creater;
	}

	public void setCreater(UserBaseVO creater) {
		this.creater = creater;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public List<DecorationPaymentVO> getPayments() {
		return payments;
	}

	public void setPayments(List<DecorationPaymentVO> payments) {
		this.payments = payments;
	}

	public List<Integer> getPaymentRates() {
		return paymentRates;
	}

	public void setPaymentRates(List<Integer> paymentRates) {
		this.paymentRates = paymentRates;
	}

	public Long getNetperfor() {
		return netperfor;
	}

	public void setNetperfor(Long netperfor) {
		this.netperfor = netperfor;
	}

	public Long getComperfor() {
		return comperfor;
	}

	public void setComperfor(Long comperfor) {
		this.comperfor = comperfor;
	}
	
}
