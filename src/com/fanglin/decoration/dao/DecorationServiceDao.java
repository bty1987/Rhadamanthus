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

	/**
	 * 根据订单ID和服务类型查询最近一条记录
	 * @param orderId 订单ID
	 * @param type 服务类型
	 * @return 最近的服务记录
	 */
	public DecorationServicePO queryLatestByOrderIdAndType(String orderId, short type);

}
