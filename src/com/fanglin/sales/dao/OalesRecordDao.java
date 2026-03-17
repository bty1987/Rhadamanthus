package com.fanglin.sales.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.po.OalesRecordPO;
import com.fanglin.utils.Paging;

/**
 * 外销单操作记录DAO接口
 *
 * @author AI Assistant
 * @date 2026-03-17
 */
public interface OalesRecordDao extends Dao<OalesRecordPO> {

	/**
	 * 分页查询外销单操作记录
	 *
	 * @param paging 分页对象
	 * @param filters 过滤条件
	 * @param oid 外销单ID（可选，如果为null则查询所有）
	 * @return 记录列表
	 * @throws FLException 异常
	 */
	List<OalesRecordPO> pageOalesRecord(Paging paging, List<Filter> filters, Long oid) throws FLException;

	/**
	 * 根据外销单ID查询操作记录
	 *
	 * @param oid 外销单ID
	 * @return 记录列表
	 */
	List<OalesRecordPO> queryOalesRecordByOid(long oid);

	/**
	 * 根据支付记录ID查询操作记录
	 *
	 * @param opid 支付记录ID
	 * @return 记录列表
	 */
	List<OalesRecordPO> queryOalesRecordByOpid(long opid);
}
