/**
 * @File Name		: A20261117Service.java
 * @Package   	: com.fanglin.seiya.service
 * @Version		: 1.0
 * @Date			: 2026-11-17
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 上方系统定额补数服务(工费/辅料两接口 → quotation.normriceitem/normooditem 实例层)
 */

package com.fanglin.seiya.service;

import com.fanglin.core.interceptor.FLException;

public interface A20261117Service {

	/**
	 * 三方工费补数: 调上方系统工费清单查询接口(appId=erp_project_sync), 落 quotation.normriceitem 实例层。
	 *
	 * <p>数据模型: 三方定额不关联报价项(这类单报价无明细), 以 normtion 单据(qid)锚单——
	 * qiid/areald/quoteld/npid 均置 0, type=3 定额行(幸存 makeNormtion 重跑 disable),
	 * normtype=1 走附加项确认流(confirmNormriceItem 确认后计入工资核算 amountNormriceItemForSalary),
	 * trannum=0 总额行(salary=amount厘, 工资SQL与前端原生兼容不乘工程量)。
	 *
	 * <p>公共前置: 装修单判断(140013) → 公司开关(norm.sync.enable 公司行, 未配置走现有逻辑返回 0)
	 * → 报价判断(200003, 报价可无明细但行必须存在) → normtion 单据头判断不存在创建。
	 *
	 * <p>仅补缺: 该单 type=3 现存 INIT/CONFIRMED 行同 cnid 跳过; 接口失败/数据为空/字典查不到 fail-closed
	 * 抛 FLException(200132~200135)。
	 *
	 * @param orderId 装修单号(即上方系统 erpOrderCode)
	 * @param userId  操作人(补 normtion.creater)
	 * @return 实际补插的工费行数(0=公司未启用或全部已存在)
	 */
	public int syncNormriceItem(String orderId, String userId) throws FLException;

	/**
	 * 三方辅料补数: 调上方系统辅料单查询接口(appId=erp_project_sync), 落 quotation.normooditem 实例层。
	 *
	 * <p>数据模型同 {@link #syncNormriceItem(String, String)}: qiid=0/type=3/normtype=0(材料),
	 * normnum=storenum=quantity毫(实例层直存实际量, 辅料管控 amountNormoodItem 无 type 过滤 INIT 即计)。
	 *
	 * @param orderId 装修单号(即上方系统 erpOrderCode)
	 * @param userId  操作人(补 normtion.creater)
	 * @return 实际补插的辅料行数(0=公司未启用或全部已存在)
	 */
	public int syncNormoodItem(String orderId, String userId) throws FLException;

}
