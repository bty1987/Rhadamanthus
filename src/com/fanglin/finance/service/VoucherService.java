/**
 * @File Name		: VoucherService.java
 * @Package   	: com.fanglin.finance.service
 * @Version		: 1.0
 * @Date			: 2015-12-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.finance.vo.VoucherVO;
import com.fanglin.utils.Paging;

public interface VoucherService {
	
	public void pageVoucher(Paging paging, List<Filter> filters, String condition);
	
	public VoucherVO queryVoucherByVId(VoucherVO voucherVO) throws FLException;
	
	public int addVoucher(VoucherVO voucherVO, List<Long> atIds, String userId) throws FLException ;
	
	public int updateVoucher(VoucherVO voucherVO, List<Long> atIds, List<Long> uatIds, List<Long> datIds) throws FLException;
	
	public int postVoucher(VoucherVO voucherVO, String userId) throws FLException;
	
	public int postVouchers(List<Long> vIds, String userId) throws FLException;
	
	public int inpostVoucher(VoucherVO voucherVO, String userId) throws FLException;
	
}
