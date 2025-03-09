package com.fanglin.approval.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.approval.vo.ApprovalSalesRefundVO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.utils.BeanUtil;

@Entity
@Table(name = "approvalsalesrefund", catalog = "approval")
public class ApprovalSalesRefundAO implements java.io.Serializable {

	private static final long serialVersionUID = 2272182475271119881L;

	public static final String COLUMN_AID_STR = "aid";

	public static final short TYPE_REFUND_INT = 1;

	private long asrid;

	private ApprovalPO approval;

	private SalesPO sales;

	private long refund;

	private short type;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "asrid")
	public long getAsrid() {
		return this.asrid;
	}

	public void setAsrid(long asrid) {
		this.asrid = asrid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "aid", referencedColumnName = "aid")
	public ApprovalPO getApproval() {
		return approval;
	}

	public void setApproval(ApprovalPO approval) {
		this.approval = approval;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sid", referencedColumnName = "sid")
	public SalesPO getSales() {
		return sales;
	}

	public void setSales(SalesPO sales) {
		this.sales = sales;
	}

	@Column(name = "refund")
	public long getRefund() {
		return this.refund;
	}

	public void setRefund(long refund) {
		this.refund = refund;
	}

	@Column(name = "type")
	public short getType() {
		return this.type;
	}

	public void setType(short type) {
		this.type = type;
	}

	public ApprovalSalesRefundVO ptv(ApprovalSalesRefundVO approvalSalesRefundVO) {

		BeanUtil.copyProperties(this, approvalSalesRefundVO, Arrays.asList("approval", "sales"));

		if (approvalSalesRefundVO.getApproval() != null) getApproval().ptv(approvalSalesRefundVO.getApproval());
		if (approvalSalesRefundVO.getSales() != null) getSales().ptv(approvalSalesRefundVO.getSales());

		return approvalSalesRefundVO;
	}

}
