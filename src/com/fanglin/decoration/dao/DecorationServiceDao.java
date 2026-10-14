package com.fanglin.decoration.dao;

import java.sql.Timestamp;
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

	/**
	 * 根据订单ID和服务类型查询最近一条记录
	 * 
	 * @param orderId 订单ID
	 * @param type 服务类型
	 * @return 最近的服务记录
	 */
	public DecorationServicePO queryDecorationService(String orderId, short type);

	public int makeDecorationService(short type, String orderId, int ouid);

	// ==================== 设计确认相关方法 ====================

	/**
	 * 查询订单的设计确认记录列表(type=1)
	 */
	public List<DecorationServicePO> queryDecorationServiceForDesignConfirmByOrderId(String orderId);

	/**
	 * 查询订单的待确认设计记录
	 */
	public DecorationServicePO queryDecorationServiceForPendingByOrderId(String orderId);

	/**
	 * 获取订单的下一确认轮次
	 */
	public int getNextRoundForDesignConfirmByOrderId(String orderId);

	/**
	 * 按订单批量完结未闭环的设计确认记录(type=1, status=0→1)
	 *
	 * @param orderId 订单ID
	 * @param finishTime 完结时间
	 * @return 完结记录数
	 */
	public int updateDecorationServiceForFinishByOrderId(String orderId, Timestamp finishTime);

}
