package com.fanglin.sales.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.vo.OalesRecordVO;
import com.fanglin.utils.Paging;

/**
 * 外销单操作记录Service接口
 * 
 * @author AI Assistant
 * @date 2026-03-17
 */
public interface OalesRecordService {

	/**
	 * 分页查询外销单操作记录
	 * 
	 * @param paging 分页对象
	 * @param filters 过滤条件
	 * @param oid 外销单ID（可选）
	 * @throws FLException 异常
	 */
	void pageOalesRecord(Paging paging, List<Filter> filters, Long oid) throws FLException;

	/**
	 * 根据外销单ID查询操作记录
	 * 
	 * @param oid 外销单ID
	 * @return 记录列表
	 * @throws FLException 异常
	 */
	List<OalesRecordVO> queryOalesRecordByOid(long oid) throws FLException;

	/**
	 * 添加操作记录（基础方法）
	 * 
	 * @param oid 外销单ID
	 * @param type 操作类型
	 * @param userId 操作人ID
	 * @param comment 备注说明
	 * @throws FLException 异常
	 */
	void addOalesRecord(long oid, short type, String userId, String comment) throws FLException;

	/**
	 * 添加操作记录（带状态变更）
	 * 
	 * @param oid 外销单ID
	 * @param type 操作类型
	 * @param userId 操作人ID
	 * @param comment 备注说明
	 * @param beforeStatus 操作前状态
	 * @param afterStatus 操作后状态
	 * @throws FLException 异常
	 */
	void addOalesRecord(long oid, short type, String userId, String comment, Short beforeStatus, Short afterStatus) throws FLException;

	/**
	 * 添加支付相关操作记录
	 * 
	 * @param oid 外销单ID
	 * @param opid 支付记录ID
	 * @param type 操作类型
	 * @param userId 操作人ID
	 * @param comment 备注说明
	 * @throws FLException 异常
	 */
	void addOalesPayRecord(long oid, long opid, short type, String userId, String comment) throws FLException;

	/**
	 * 批量添加操作记录
	 * 
	 * @param oid 外销单ID
	 * @param type 操作类型
	 * @param userId 操作人ID
	 * @param comment 备注说明
	 * @throws FLException 异常
	 */
	void addOalesRecordBatch(long oid, short type, String userId, String comment) throws FLException;
}
