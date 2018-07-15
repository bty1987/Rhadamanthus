package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.VpaymentPO;
import com.fanglin.utils.Paging;

public interface VpaymentDao extends Dao<VpaymentPO>{

	public List<VpaymentPO> pageVpayment(Paging paging, List<Filter> filters, Short status);
	
	public List<?> countVpayment();

	public List<VpaymentPO> queryVpaymentByNo(String mno);
	
	public List<VpaymentPO> queryVpaymentByVrid(long vrid);
	
}
