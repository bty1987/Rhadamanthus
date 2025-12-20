package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationServiceDO;
import com.fanglin.decoration.po.DecorationServicePO;
import com.fanglin.utils.Paging;

public interface DecorationServiceDao extends Dao<DecorationServicePO> {

	public List<DecorationServiceDO> pageDecorationService(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<DecorationServicePO> queryDecorationServiceByOrderId(String orderId);

	public int makeDecorationService(short type, String orderId, int ouid);

}
