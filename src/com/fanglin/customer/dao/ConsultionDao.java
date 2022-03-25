package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.ConsultionPO;
import com.fanglin.utils.Paging;

public interface ConsultionDao extends Dao<ConsultionPO> {

	public List<ConsultionPO> pageConsultion(Paging paging, List<Filter> filters);

	public List<ConsultionPO> queryConsultionByOrderId(String orderId);

}
