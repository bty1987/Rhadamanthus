package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationServicePO;

public interface DecorationServiceDao extends Dao<DecorationServicePO> {

	public List<DecorationServicePO> queryDecorationServiceByOrderId(String orderId);

	public int makeDecorationService(short type, String orderId, int ouid);

	public List<DecorationServicePO> pageDecorationService(com.fanglin.utils.Paging paging, java.util.List<com.fanglin.core.vo.Filter> filters, int company) throws com.fanglin.core.interceptor.FLException;

}
