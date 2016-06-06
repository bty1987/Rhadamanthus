/**
 * @File Name		: QuotationServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.dao.FunctionAreaDao;
import com.fanglin.data.quotation.dao.FunctionAreaItemDao;
import com.fanglin.data.quotation.po.FunctionAreaItemPO;
import com.fanglin.data.quotation.po.FunctionAreaPO;
import com.fanglin.data.quotation.po.QuotationItemPO;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.QuotationService;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.SystemConfig;

@Service("quotationService")
@Transactional(readOnly=true)
public class QuotationServiceImpl implements QuotationService {

	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;
	
	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;
	
	@Autowired
	private FunctionAreaDao functionAreaDao;
	
	@Autowired
	private FunctionAreaItemDao functionAreaItemDao;
	
	@Override
	public QuotationVO queryQuotationById(long autoId){
		QuotationPO quotationPO = quotationDao.get(autoId);
		QuotationVO quotationVO = new QuotationVO();
		
		if(quotationPO != null){
			
			DecorationOrderPO decorationOrderPO = quotationPO.getDecorationOrder();
			UserPO createUser = quotationPO.getCreateUser();
			
			BeanUtil.copyProperties(quotationPO, quotationVO);

			quotationVO.setCreaterId(createUser.getUserId());
			quotationVO.setCreaterName(createUser.getCurrentName());
			quotationVO.setOrderId(decorationOrderPO.getOrderId());
			quotationVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
			
			quotationVO.setVersionId(decorationOrderPO.getVersionPO().getVersionId());
		}
		
		return quotationVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public QuotationVO queryQuotationForDefaultByOrderId(QuotationVO quotationVO){
		
		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(quotationVO.getOrderId());
		
		if(quotationPO != null){
			
			DecorationOrderPO decorationOrderPO = quotationPO.getDecorationOrder();
			UserPO createUser = quotationPO.getCreateUser();
			
			BeanUtil.copyProperties(quotationPO, quotationVO);

			quotationVO.setCreaterId(createUser.getUserId());
			quotationVO.setCreaterName(createUser.getCurrentName());
			quotationVO.setOrderId(decorationOrderPO.getOrderId());
			quotationVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
			
			quotationVO.setVersionId(decorationOrderPO.getVersionPO().getVersionId());
		}
		
		return quotationVO;
	}
	
	@Override
	public int checkQuotationForStatusByOrderId(QuotationVO quotationVO, QuotationPO quotationPO, boolean priceFlag) throws FLException{
		
		int result = 2;
		
		DecorationOrderPO decorationOrderPO = null;
		
		if(quotationVO != null){
			decorationOrderPO = decorationOrderDao.queryOrderByOrderId(quotationVO.getOrderId());
		}else if(quotationPO != null){
			decorationOrderPO = quotationPO.getDecorationOrder();
		}
		
		List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_CONSULT_STR, DecorationOrderPO.STATUS_AMOUNT_STR, DecorationOrderPO.STATUS_QUOTATION_STR, DecorationOrderPO.STATUS_DEPOSIT_STR, DecorationOrderPO.STATUS_RESIGNED_STR, DecorationOrderPO.STATUS_SIGNED_STR});
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		if(!status.contains(decorationOrderPO.getStatus())){
			throw new FLException(200005, "报价不能修改");
		}
		
		if(DecorationOrderPO.STATUS_SIGNED_STR.equals(decorationOrderPO.getStatus())){
			
			long adjustmentTime = SystemConfig.getInt("adjustmentDate", 2) * 24 * 60 * 60 * 1000;
			long endTime  = (new Date()).getTime() - adjustmentTime;
			
			if(endTime > decorationOrderPO.getContractTime().getTime()){
				throw new FLException(200005, "超出报价修改期限,不能修改");
			}else{
				if(priceFlag && Math.abs(Arith.sub(quotationPO.getTotalPrice(), decorationOrderPO.getOrderTotalPrice())) > 100){
					throw new FLException(200004, "报价信息只能微调,总额不能超过100");
				}
			}
		}
		
		return result;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<QuotationVO> queryQuotationByOrderId(QuotationVO quotationVO){
		List<QuotationVO> quotationVOs = new ArrayList<QuotationVO>();
		
		List<QuotationPO> quotationPOs = quotationDao.queryQuotationByOrderId(quotationVO.getOrderId());
		
		for(QuotationPO quotationPO: quotationPOs){
			QuotationVO _quotationVO = new QuotationVO();
			
			DecorationOrderPO decorationOrderPO = quotationPO.getDecorationOrder();
			UserPO createUser = quotationPO.getCreateUser();
			
			BeanUtil.copyProperties(quotationPO, _quotationVO);
			
			_quotationVO.setCreaterId(createUser.getUserId());
			_quotationVO.setCreaterName(createUser.getCurrentName());
			_quotationVO.setOrderId(decorationOrderPO.getOrderId());
			_quotationVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
			
			quotationVO.setVersionId(decorationOrderPO.getVersionPO().getVersionId());
			
			quotationVOs.add(_quotationVO);
		}
		
		return quotationVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addQuotation(QuotationVO quotationVO, String userId) throws FLException{
		List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_CONSULT_STR, DecorationOrderPO.STATUS_AMOUNT_STR});
		
		String orderId = quotationVO.getOrderId();
		
		QuotationPO quotationPO = new QuotationPO();
		
		if(quotationDao.countQuotationByOrderId(orderId) >= SystemConfig.getInt("limitQuotationNumber", 3)){
			throw new FLException(200001, "报价已经达到数量上限");
		}
		
		checkQuotationForStatusByOrderId(quotationVO, null, false);
		
		BeanUtil.copyProperties(quotationVO, quotationPO);
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(orderId);
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		quotationPO.setDecorationOrder(decorationOrderPO);
		quotationPO.setCreateUser(new UserPO(userId));
		quotationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		quotationPO.setSaveStatus(1);
		quotationPO.setDiscount(10);
		
		QuotationPO defaultQuotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);
		if(defaultQuotationPO == null){
			quotationPO.setStatus(1);
		}else{
			quotationPO.setStatus(0);
		}
		quotationDao.save(quotationPO);
		
		if(status.contains(decorationOrderPO.getStatus())){
			decorationOrderPO.setStatus(DecorationOrderPO.STATUS_QUOTATION_STR);
			decorationOrderDao.saveOrUpdate(decorationOrderPO);
		}
		
		createQuotationDetailByVersionIdAndQuotationId(quotationPO.getQid(), decorationOrderPO.getVersionPO().getVersionId());
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotation(QuotationVO quotationVO) throws FLException{
		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());

		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		checkQuotationForStatusByOrderId(null, quotationPO, false);
		
		quotationPO.setDecorationStyle(quotationVO.getDecorationStyle());
		quotationPO.setQuotationName(quotationVO.getQuotationName());
		quotationPO.setQuotationContent(quotationVO.getQuotationContent());
		
		quotationDao.update(quotationPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotationForDefault(QuotationVO quotationVO) throws FLException{
		
		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		checkQuotationForStatusByOrderId(null, quotationPO, true);
		
		if(quotationPO.getStatus() == 0){
			quotationPO.setStatus(1);
			
			quotationDao.clearQuotationForDefaultByOrderId(quotationVO.getOrderId());
			quotationDao.update(quotationPO);
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotationForStatus(QuotationVO quotationVO) throws FLException{
		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());

		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		checkQuotationForStatusByOrderId(null, quotationPO, true);
		
		quotationPO.setSaveStatus(quotationVO.getSaveStatus());
		
		quotationDao.saveOrUpdate(quotationPO);
		
		return 0;
	}
	
	@Override
	public int updateQuotationForAdvance(QuotationVO quotationVO) throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		checkQuotationForStatusByOrderId(null, quotationPO, false);
		
		convertQuotationVOToPOForAdvance(quotationVO, quotationPO);
		
		quotationDao.update(quotationPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int replicaQuotation(QuotationVO quotationVO) throws FLException{
		
		List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_CONSULT_STR, DecorationOrderPO.STATUS_AMOUNT_STR});
		
		QuotationPO quotationPO = new QuotationPO();

		long replicaQId = quotationVO.getQid();
		String orderId = quotationVO.getOrderId();
		
		if(quotationDao.countQuotationByOrderId(orderId) >= SystemConfig.getInt("limitQuotationNumber", 3)){
			throw new FLException(200001, "报价已经达到数量上限");
		}

		checkQuotationForStatusByOrderId(quotationVO, null, false);
    
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(orderId);
		
		if(decorationOrderPO.getQuotationTimeLimit() >= SystemConfig.getInt("quotationTimeLimit")){
			throw new FLException(200018, "报价复制次数达到上线");
		}else{
			decorationOrderPO.setQuotationTimeLimit(decorationOrderPO.getQuotationTimeLimit() + 1);
			decorationOrderDao.update(decorationOrderPO);
		}
		
		BeanUtil.copyProperties(quotationVO, quotationPO, "qId");
		
		quotationPO.setDecorationOrder(decorationOrderPO);
		quotationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		QuotationPO copyQuotationPO = quotationDao.get(replicaQId);
		quotationPO.setQuotationName(copyQuotationPO.getQuotationName());
		quotationPO.setDecorationStyle(copyQuotationPO.getDecorationStyle());
		quotationPO.setSaveStatus(1);
		quotationPO.setDiscount(10);
		quotationPO.setTotalPrice(0);
		quotationPO.setCreateUser(copyQuotationPO.getCreateUser());
		quotationPO.setQuotationContent("");
		
		if(orderId.equals(copyQuotationPO.getDecorationOrder().getOrderId())){
			throw new FLException(200019, "拷贝报价不能在订单内完成");
		}
		
		if(!decorationOrderPO.getVersionPO().getVersionId().equals(copyQuotationPO.getDecorationOrder().getVersionPO().getVersionId())){
			throw new FLException(200002, "复制报价与当前报价版本不同,不能拷贝");
		}
		
		QuotationPO defaultQuotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);
		
		if(defaultQuotationPO != null){
			deleteQuotationByQId(defaultQuotationPO.getQid());
		}
		
		quotationPO.setStatus(1); // 设置复制报价为默认报价
		
		quotationDao.save(quotationPO);
		
		copyQuotation(replicaQId, quotationPO.getQid());
		
		if(status.contains(decorationOrderPO.getStatus())){
			decorationOrderPO.setStatus("已报价");
			decorationOrderDao.saveOrUpdate(decorationOrderPO);
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int copyQuotation(QuotationVO quotationVO, String userId) throws FLException{
		
		long copyAutoId = quotationVO.getQid();
		String orderId = quotationVO.getOrderId();
		
		QuotationPO quotationPO = new QuotationPO();

		checkQuotationForStatusByOrderId(quotationVO, null, false);
			
		if(quotationDao.countQuotationByOrderId(orderId) >= SystemConfig.getInt("limitQuotationNumber", 3)){
			throw new FLException(200001, "报价已经达到数量上限");
		}

		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(orderId);
		
		if(decorationOrderPO.getQuotationTimeLimit() >= SystemConfig.getInt("quotationTimeLimit")){
			throw new FLException(200018, "报价复制次数达到上线");
		}else{
			decorationOrderPO.setQuotationTimeLimit(decorationOrderPO.getQuotationTimeLimit() + 1);
			decorationOrderDao.update(decorationOrderPO);
		}
		
		BeanUtil.copyProperties(quotationVO, quotationPO, "qId");
		
		quotationPO.setDecorationOrder(decorationOrderPO);
		quotationPO.setCreateUser(new UserPO(userId));
		quotationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		QuotationPO copyPO = quotationDao.get(copyAutoId);
		quotationPO.setSaveStatus(1);
		quotationPO.setDiscount(copyPO.getDiscount());
		quotationPO.setTotalPrice(copyPO.getTotalPrice());
		
		QuotationPO defaultQuotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);
		
		if(defaultQuotationPO == null){
			quotationPO.setStatus(1);
		}else{
			quotationPO.setStatus(0);
		}
		quotationDao.save(quotationPO);
		
		copyQuotation(copyAutoId, quotationPO.getQid());
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteQuotationById(QuotationVO quotationVO) throws FLException{	
		
		Long qId = quotationVO.getQid();
		
		QuotationPO quotationPO = quotationDao.get(qId);
		
		checkQuotationForStatusByOrderId(null, quotationPO, false);
		
		if(quotationPO.getStatus() == 1){
			throw new FLException(200014, "默认报价不能删除");
		}
		
		deleteQuotationByQId(qId);
		
		return 0;
	}
	
	@Transactional(rollbackFor=Exception.class)
	private int copyQuotation(long quotationId, long newQuotationId){

		List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationId);
		
		for(QuotationFunctionAreaPO quotationFunctionAreaPO: quotationFunctionAreaPOs){
			
			QuotationFunctionAreaPO _quotationFunctionAreaPO = new QuotationFunctionAreaPO();
			BeanUtil.copyProperties(quotationFunctionAreaPO, _quotationFunctionAreaPO, Arrays.asList("qfaId"));
			_quotationFunctionAreaPO.setQuotation(new QuotationPO(newQuotationId));
			
			List<QuotationFunctionAreaItemPO> quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaId(quotationFunctionAreaPO.getQfaId());
			
			quotationFunctionAreaDao.save(_quotationFunctionAreaPO);
			
			for(QuotationFunctionAreaItemPO quotationFunctionAreaItemPO: quotationFunctionAreaItemPOs){
				QuotationFunctionAreaItemPO _quotationFunctionAreaItemPO  = new QuotationFunctionAreaItemPO();
				BeanUtil.copyProperties(quotationFunctionAreaItemPO, _quotationFunctionAreaItemPO, Arrays.asList("qfaiId"));
				
				_quotationFunctionAreaItemPO.setQuotationFunctionArea(_quotationFunctionAreaPO);
				
				quotationFunctionAreaItemDao.save(_quotationFunctionAreaItemPO);
			}
		}
		
		return 0;
	}
	
	@Transactional(rollbackFor=Exception.class)
	private int createQuotationDetailByVersionIdAndQuotationId(long quotationId, String versionId){

		List<FunctionAreaPO> functionAreaPOs = functionAreaDao.queryFunctionAreaForSpecialByVersionId(versionId);
		
		for(FunctionAreaPO functionAreaPO: functionAreaPOs){
			QuotationFunctionAreaPO quotationFunctionAreaPO = new QuotationFunctionAreaPO();
			quotationFunctionAreaPO.setFunctionAreaName(functionAreaPO.getFunctionAreaName());
			quotationFunctionAreaPO.setFunctionAreaOrder(functionAreaPO.getFunctionAreaOrder());
			quotationFunctionAreaPO.setFunctionAreaType(functionAreaPO.getFunctionAreaType());
			quotationFunctionAreaPO.setQuotation(new QuotationPO(quotationId));
			
			quotationFunctionAreaDao.save(quotationFunctionAreaPO);
			
			List<FunctionAreaItemPO> functionAreaItemPOs = functionAreaItemDao.queryFunctionAreaItemByFunctionAreaId(functionAreaPO.getAutoId());
			for(FunctionAreaItemPO functionAreaItemPO: functionAreaItemPOs){
				
				QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = new QuotationFunctionAreaItemPO();
				
				quotationFunctionAreaItemPO.setNum((float) 0);
				quotationFunctionAreaItemPO.setQuotationFunctionArea(quotationFunctionAreaPO);
				quotationFunctionAreaItemPO.setQuotationItem(new QuotationItemPO(functionAreaItemPO.getQuotationItem().getQiId()));
				
				quotationFunctionAreaItemDao.save(quotationFunctionAreaItemPO);
			}
		}
		
		return 0;
	}
	
	@Transactional(rollbackFor=Exception.class)
	private int deleteQuotationByQId(long qId){
		
		List<QuotationFunctionAreaPO> quotationFunctionAreas = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(qId);
		
		for(QuotationFunctionAreaPO quotationFunctionAreaPO: quotationFunctionAreas){
			
			long quotatoinFunctionAreaId = quotationFunctionAreaPO.getQfaId();
			
			quotationFunctionAreaItemDao.deleteQuotationFunctionAreaItemByFunctionAreaId(quotatoinFunctionAreaId); // 删除报价项
			quotationFunctionAreaDao.deleteById(quotatoinFunctionAreaId); // 删除功能区
		}
		
		quotationDao.deleteById(qId); // 删除报价
		
		return 0;
	}
	
	public static void convertQuotationVOToPOForAdvance(QuotationVO quotationVO, QuotationPO quotationPO){
		quotationPO.setDiscount(quotationVO.getDiscount());
		quotationPO.setTotalPrice(quotationVO.getTotalPrice());
		quotationPO.setLatexCut(quotationVO.getLatexCut());
		quotationPO.setManagePrice(quotationVO.getManagePrice());
		quotationPO.setManageRate(quotationVO.getManageRate());
		quotationPO.setTrafficPrice(quotationVO.getTrafficPrice());
	}

}
