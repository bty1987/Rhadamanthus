package com.fanglin.payment.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.po.ActivityPaymentPO;
import com.fanglin.utils.Paging;

public interface ActivityPaymentDao extends Dao<ActivityPaymentPO>{

	public List<ActivityPaymentPO> pageActivityPayment(Paging paging, List<Filter> filters, Short status);

	public List<ActivityPaymentPO> queryActivityPaymentByNo(String mno);
	
	public List<ActivityPaymentPO> queryActivityPaymentByArid(long arid);
	
	public List<List<String>> countActivityPayment();
	
}
