/**
 * @File Name		: A20261117Service.java
 * @Package   	: com.fanglin.seiya.service
 * @Version		: 1.0
 * @Date			: 2026-11-17
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 上方系统定额补数服务(工费/辅料两接口 → data.normrice/data.normood)
 */

package com.fanglin.seiya.service;

import com.fanglin.core.interceptor.FLException;

public interface A20261117Service {

	/**
	 * 三方定额补数: 按装修单(erpOrderCode)调上方系统工费清单/辅料单两接口, 补充 data.normrice/data.normood。
	 *
	 * <p>落行口径(trannum=0 总额行约定, 全栈现成): 工费行挂锚点报价项(cnid=接口id, trannum=0, salary=amount厘),
	 * 实例生成与工资核算不乘工程量; 辅料行挂锚点报价项(nid=接口nid, normnum=storenum=quantity毫÷锚点工程量)。
	 * normtion 单据头判断不存在进行创建。
	 *
	 * <p>仅补缺: 该单报价任一报价项下已有同 cnid/nid 的定额行则跳过该三方行(规格链/人工维护优先, 幂等)。
	 *
	 * <p>公司开关(communion.systemconfig 公司行 norm.sync.enable=1): 未启用直接返回 0 走现有逻辑;
	 * 启用后接口失败/超时/数据为空/数据异常(cnid、nid 查不到字典)一律 fail-closed 抛 FLException(200132~200136)。
	 *
	 * @param orderId 装修单号(即上方系统 erpOrderCode)
	 * @param userId  操作人(补 normtion.creater)
	 * @return 实际补插的定额行数(0=公司未启用或全部已存在)
	 */
	public int supplementNormForSync(String orderId, String userId) throws FLException;

}
