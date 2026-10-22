/**
 * @File Name		: DecorationContractDao
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationContractPO;

public interface DecorationContractDao extends Dao<DecorationContractPO> {

	public List<DecorationContractPO> queryDecorationContractByOrderId(String orderId);

	/**
	 * 巡检扫描：指定厂商、状态集、创建早于截止时间的合同（卡流兜底任务用）。
	 *
	 * @param provider 厂商码
	 * @param status 状态集（如 0初始/1已签）
	 * @param deadline 创建时间截止（早于该时间的才扫）
	 * @param limit 单次最大行数
	 */
	public List<DecorationContractPO> queryDecorationContractForFlowPatrol(Short provider, List<Short> status, java.sql.Timestamp deadline, int limit);
}
