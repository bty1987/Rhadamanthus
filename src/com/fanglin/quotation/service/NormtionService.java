/**
 * @File Name		: QuotationFunctionAreaService.java
 * @Package   	: com.fanglin.quotation.service
 * @Version		: 1.0
 * @Date			: 2016-6-5
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.NormoodVO;
import com.fanglin.data.quotation.vo.NormriceVO;
import com.fanglin.data.quotation.vo.NormtimeVO;
import com.fanglin.quotation.vo.AddReduceVO;
import com.fanglin.quotation.vo.ExtensionVO;
import com.fanglin.quotation.vo.NormtionVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.Paging;

public interface NormtionService {

	public void pageNormtion(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public List<QuotationFunctionAreaVO> queryQuotationNormood(QuotationVO quotationVO) throws FLException;

	public List<ExtensionVO> queryExtensionNormood(ExtensionVO extensionVO) throws FLException;

	public List<AddReduceVO> queryAddReduceNormood(AddReduceVO addReduceVO) throws FLException;

	public List<QuotationFunctionAreaVO> queryQuotationNormrice(QuotationVO quotationVO, Short schedule) throws FLException;

	public List<ExtensionVO> queryExtensionNormrice(ExtensionVO extensionVO, Short schedule) throws FLException;

	public List<AddReduceVO> queryAddReduceNormrice(AddReduceVO addReduceVO, Short schedule) throws FLException;

	public List<QuotationFunctionAreaVO> queryQuotationNormtime(QuotationVO quotationVO, Short schedule) throws FLException;

	public List<ExtensionVO> queryExtensionNormtime(ExtensionVO extensionVO, Short schedule) throws FLException;

	public List<AddReduceVO> queryAddReduceNormtime(AddReduceVO addReduceVO, Short schedule) throws FLException;

	public List<NormoodVO> amountQuotationNormood(QuotationVO quotationVO) throws FLException;

	public List<NormoodVO> amountExtensionNormood(ExtensionVO extensionVO) throws FLException;

	public List<NormoodVO> amountAddReduceNormood(AddReduceVO addReduceVO) throws FLException;

	public List<NormriceVO> amountQuotationNormrice(QuotationVO quotationVO) throws FLException;

	public List<NormriceVO> amountExtensionNormrice(ExtensionVO extensionVO) throws FLException;

	public List<NormriceVO> amountAddReduceNormrice(AddReduceVO addReduceVO) throws FLException;

	public List<NormtimeVO> amountQuotationNormtime(QuotationVO quotationVO) throws FLException;

	public List<NormtimeVO> amountExtensionNormtime(ExtensionVO extensionVO) throws FLException;

	public List<NormtimeVO> amountAddReduceNormtime(AddReduceVO addReduceVO) throws FLException;

	public NormtionVO queryNormtion(NormtionVO normtionVO) throws FLException;

	public int makeNormtion(NormtionVO normtionVO, String userId) throws FLException;

	public int makeNormtion(NormtionVO normtionVO, Short schedule, String userId) throws FLException;

	public int makeNormtion(NormtionVO normtionVO, ExtensionVO extensionVO, Short schedule, String userId) throws FLException;

	public int makeNormtion(NormtionVO normtionVO, AddReduceVO addReduceVO, Short schedule, String userId) throws FLException;

	public int printNormtion(NormtionVO normtionVO) throws FLException;

	public int addNormtion(NormtionVO normtionVO, String userId) throws FLException;

	public int updateNormtionForStatus(NormtionVO normtionVO, String userId) throws FLException;


	/**
	 * 三方工费补数(实现为 seiya A20261117 端点 syncNormriceItem 与 makeNormtion 双源路由共用):
	 * 调上方系统工费清单查询接口(appId=erp_project_sync, fl-sync 统一验签), 仅补缺落 quotation.normriceitem 实例层
	 * (type=3/normtype=1 确认流/trannum=0 总额行, qid 锚单 qiid=0 不关联报价项);
	 * 公共前置: 装修单(140013) → 公司开关(norm.sync.enable 未配置走现有逻辑返回 0) → 报价(200003) → normtion 头创建;
	 * fail-closed: 三方未配置/调用失败/数据空/数据异常抛 200132~200135
	 *
	 * @param orderId 装修单号(即上方系统 erpOrderCode)
	 * @param userId  操作人(补 normtion.creater)
	 * @return 实际补插的工费行数(0=公司未启用或全部已存在)
	 * @throws FLException 业务异常
	 */
	public int syncNormriceItem(String orderId, String userId) throws FLException;

	/**
	 * 三方辅料补数(数据模型同 {@link #syncNormriceItem(String, String)}): 调上方系统辅料单查询接口,
	 * 仅补缺落 quotation.normooditem 实例层(normtype=0/normnum=storenum=quantity毫, 辅料管控 INIT 即计)
	 *
	 * @param orderId 装修单号(即上方系统 erpOrderCode)
	 * @param userId  操作人(补 normtion.creater)
	 * @return 实际补插的辅料行数(0=公司未启用或全部已存在)
	 * @throws FLException 业务异常
	 */
	public int syncNormoodItem(String orderId, String userId) throws FLException;

}