/**
 * @File Name		: A20261117ServiceImpl.java
 * @Package   	: com.fanglin.seiya.service.impl
 * @Version		: 1.0
 * @Date			: 2026-11-17
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 上方系统定额补数服务实现(工费/辅料两接口 → quotation.normriceitem/normooditem 实例层直存)
 *
 *                   端点壳(Phase 1): HTTP 触发入口, 业务实现下沉 quotation.NormtionService
 *                   (2026-11-22 解耦——三方补数由 makeNormtion 双源路由与seiya端点共用同一实现,
 *                   其他模块不依赖 seiya 方法, 依赖方向统一为 seiya→quotation)。
 *                   数据模型: 三方定额不关联报价项(这类单报价无明细), 以 normtion 单据(qid)锚单落实例层——
 *                   normriceitem/normooditem 的 qiid/areald/quoteld/npid(ngid) 置 0, type=3 定额行
 *                   (makeNormtion 两级 disable 均带 type!=3, 幸存重跑); 工费 normtype=1 附加确认流
 *                   (confirmNormriceItem 确认后计入工资核算), 辅料 normtype=0(INIT 即计辅料管控);
 *                   工费 trannum=0 总额行(salary 即金额, 不乘工程量), 辅料 normnum=storenum=实际量(毫)。
 *                   评估与实施设计见 docs/01-方案设计/定额数据接口补充评估方案.md 第 7 节。
 */

package com.fanglin.seiya.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.NormtionService;
import com.fanglin.seiya.service.A20261117Service;

@Service("a20261117Service")
@Transactional(readOnly = true)
public class A20261117ServiceImpl implements A20261117Service {

	@Autowired
	private NormtionService normtionService;

	@Override
	public int syncNormriceItem(String orderId, String userId) throws FLException {
		return normtionService.syncNormriceItem(orderId, userId);
	}

	@Override
	public int syncNormoodItem(String orderId, String userId) throws FLException {
		return normtionService.syncNormoodItem(orderId, userId);
	}

}
