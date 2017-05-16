/**
 * @File Name		: VoucherDao.java
 * @Package   	: com.fanglin.finance.dao
 * @Version		: 1.0
 * @Date			: 2015-11-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.finance.po.VoucherPO;
import com.fanglin.utils.Paging;

public interface VoucherDao extends Dao<VoucherPO> {
	
	public List<VoucherPO> pageVoucher(Paging paging, List<Filter> filters, String condition);
	
	public VoucherPO queryVoucherByVId(long vid);
	
	public List<VoucherPO> queryVoucherByVIds(List<Long> vIds);
	
	public int updateVoucherForStatusByPeriod(String period, short status);
	
	public int alowVoucherForPeriodByPrecut(String period, String nextPeriod);
	
	public VoucherPO merge(VoucherPO voucherPO);
	
}
