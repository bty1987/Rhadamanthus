/**
 * @File Name     : QuotationAssignVO.java
 * @Package      : com.fanglin.quotation.vo
 * @Version       : 1.0
 * @Date          : 2026-03-21
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 预算员分配请求 VO
 */

package com.fanglin.quotation.vo;

import com.fanglin.personel.vo.UserBaseVO;

/**
 * 预算员分配请求 VO
 * 
 * <p>
 * 用于封装预算员自动分配、手动分配、重新分配等操作的参数
 * </p>
 * 
 * @author Claude AI
 * @version 1.0
 */
public class QuotationAssignVO {

	/**
	 * 装修单号
	 */
	private String orderId;

	/**
	 * 预算员信息（关联对象）
	 */
	private UserBaseVO quoter;

	public QuotationAssignVO() {
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public UserBaseVO getQuoter() {
		return quoter;
	}

	public void setQuoter(UserBaseVO quoter) {
		this.quoter = quoter;
	}
}
