/**
 * @File Name		: QuotationServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email			: 739061411@qqcom
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

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.CustomQuotationItemDao;
import com.fanglin.quotation.dao.FunctionAreaDao;
import com.fanglin.quotation.dao.FunctionAreaItemDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.po.CustomQuotationItemPO;
import com.fanglin.quotation.po.FunctionAreaItemPO;
import com.fanglin.quotation.po.FunctionAreaPO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationItemPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.QuotationService;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.SystemConfig;
import com.fanglin.utils.UUIDUtil;

@Service("quotationService")
@Transactional(readOnly=true)
public class QuotationServiceImpl implements QuotationService {

	@Autowired
	private CountingService countingService;
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;
	
	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;
	
	@Autowired
	private CustomQuotationItemDao customQuotationItemDao;
	
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
			quotationVO.setDesigner(createUser.getCurrentName());
			quotationVO.setDesignerId(createUser.getUserId());
			
			quotationVO.setOrderId(decorationOrderPO.getOrderId());
			quotationVO.setOrderStatus(decorationOrderPO.getStatus());
			
			quotationVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
			quotationVO.setContractTime(decorationOrderPO.getContractTime());
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
			quotationVO.setDesigner(createUser.getCurrentName());
			quotationVO.setDesignerId(createUser.getUserId());
			
			quotationVO.setOrderId(decorationOrderPO.getOrderId());
			quotationVO.setOrderStatus(decorationOrderPO.getStatus());
			
			quotationVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
			quotationVO.setContractTime(decorationOrderPO.getContractTime());
		}
		
		return quotationVO;
	}
	
	@Override
	public int queryQuotationForStatusByOrderId(QuotationVO quotationVO, QuotationPO quotationPO){
		
		String orderId;
		DecorationOrderPO decorationOrderPO = null;
		
		if(quotationVO != null){
			orderId = quotationVO.getOrderId();
			
			decorationOrderPO = decorationOrderDao.queryOrderByOrderId(orderId);
		}else if(quotationPO != null){
			decorationOrderPO = quotationPO.getDecorationOrder();
		}
		
		int res = 1;
		List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_CONSULT_STR, DecorationOrderPO.STATUS_AMOUNT_STR, DecorationOrderPO.STATUS_QUOTATION_STR, DecorationOrderPO.STATUS_DEPOSIT_STR, DecorationOrderPO.STATUS_RESIGNED_STR, DecorationOrderPO.STATUS_SIGNED_STR});
		
		if(decorationOrderPO != null && status.contains(decorationOrderPO.getStatus())){
			if(DecorationOrderPO.STATUS_SIGNED_STR.equals(decorationOrderPO.getStatus())){
				long adjustmentTime = SystemConfig.getInt("adjustmentDate", 2) * 24 * 60 * 60 * 1000;
				long endTime  = (new Date()).getTime() - adjustmentTime;
				
				if(endTime > decorationOrderPO.getContractTime().getTime()){
					res = 0;//不可改
				}else{
					res = 1;//微调
				}
			}else{
				res = 2;//随便改
			}
		}else{
			res = 0;
		}
		
		return res;
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
			
			_quotationVO.setDesigner(createUser.getCurrentName());
			_quotationVO.setDesignerId(createUser.getUserId());
			
			_quotationVO.setOrderId(decorationOrderPO.getOrderId());
			_quotationVO.setOrderStatus(decorationOrderPO.getStatus());
			
			_quotationVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
			_quotationVO.setContractTime(decorationOrderPO.getContractTime());
			
			quotationVOs.add(_quotationVO);
		}
		
		return quotationVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addQuotation(QuotationVO quotationVO) throws FLException{
		List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_CONSULT_STR, DecorationOrderPO.STATUS_AMOUNT_STR});
		
		String orderId = quotationVO.getOrderId();
		
		QuotationPO quotationPO = new QuotationPO();
		
		if(quotationDao.countQuotationByOrderId(orderId) >= SystemConfig.getInt("limitQuotationNumber", 3)){
			throw new FLException(200001, "报价已经达到数量上限");
		}
		
		if(queryQuotationForStatusByOrderId(quotationVO, null) > 0){
    
			BeanUtil.copyProperties(quotationVO, quotationPO);
			DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(orderId);
			
			if(decorationOrderPO == null){
				throw new FLException(140013, "订单不存在");
			}
			
			quotationPO.setDecorationOrder(decorationOrderPO);
			
			UserPO userPO = new UserPO();
			userPO.setUserId(quotationVO.getDesignerId());
			quotationPO.setCreateUser(userPO);
			
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
			
			createQuotationDetailByVersionIdAndQuotationId(quotationPO.getAutoId(), decorationOrderPO.getVersionPO().getVersionId());
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotation(QuotationVO quotationVO) throws FLException{
		QuotationPO quotationPO = quotationDao.get(quotationVO.getAutoId());

		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		if(queryQuotationForStatusByOrderId(null, quotationPO) > 0){

			quotationPO.setDecorationStyle(quotationVO.getDecorationStyle());
			quotationPO.setQuotationName(quotationVO.getQuotationName());
			quotationPO.setQuotationContent(quotationVO.getQuotationContent());
			
			quotationDao.saveOrUpdate(quotationPO);
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotationForDefault(QuotationVO quotationVO) throws FLException{
		
		QuotationPO quotationPO = quotationDao.get(quotationVO.getAutoId());
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		int change = queryQuotationForStatusByOrderId(null, quotationPO);
		
		if(change > 1){ // 随意改

			if(quotationPO.getStatus() == 1){
				return 0;
			}
			
			quotationPO.setStatus(1);
			
			quotationDao.clearQuotationForDefaultByOrderId(quotationVO.getOrderId());
			quotationDao.saveOrUpdate(quotationPO);
			
			return 0;
		}else if(change > 0){ // 微调
			DecorationOrderPO decorationOrderPO = quotationPO.getDecorationOrder();
			QuotationPO defaultQuotationPO = quotationDao.queryQuotationForDefaultByOrderId(quotationVO.getOrderId());
			
			if(Math.abs(Arith.sub(quotationPO.getTotalPrice(), decorationOrderPO.getOrderTotalPrice())) < 100){
				
				defaultQuotationPO.setStatus(0);
				quotationPO.setStatus(1);
				
				quotationDao.update(quotationPO);
				quotationDao.update(defaultQuotationPO);
			}else{
				throw new FLException(200004, "报价信息只能微调,总额不能超过100");
			}
			
			return 0;
		}else{
			throw new FLException(200005, "超出报价修改期限,不能修改");
		}
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotationForStatus(QuotationVO quotationVO) throws FLException{
		QuotationPO quotationPO = quotationDao.get(quotationVO.getAutoId());

		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		int change = queryQuotationForStatusByOrderId(null, quotationPO);
		
		if(change > 1){ // 随意改

			quotationPO.setSaveStatus(quotationVO.getSaveStatus());
			
			quotationDao.saveOrUpdate(quotationPO);
			
			return 0;
		}else if(change > 0){//微调
			DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(quotationVO.getOrderId());
			
			if(Math.abs(Arith.sub(quotationPO.getTotalPrice(), decorationOrderPO.getOrderTotalPrice())) < 100){
				
				quotationPO.setSaveStatus(quotationVO.getSaveStatus());
				
				quotationDao.saveOrUpdate(quotationPO);
			}else{
				throw new FLException(200004, "报价信息只能微调,总额不能超过100");
			}
			
			return 0;
		}else{
			throw new FLException(200005, "超出报价修改期限,不能修改");
		}
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int replicaQuotation(long replicaAutoId, QuotationVO quotationVO) throws FLException{
		
		List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_CONSULT_STR, DecorationOrderPO.STATUS_AMOUNT_STR});
		
		QuotationPO quotationPO = new QuotationPO();
		
		String orderId = quotationVO.getOrderId();
		
		if(quotationDao.countQuotationByOrderId(orderId) >= SystemConfig.getInt("limitQuotationNumber", 3)){
			throw new FLException(200001, "报价已经达到数量上限");
		}

		if(queryQuotationForStatusByOrderId(quotationVO, null) > 0){
    
			DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(orderId);
			
			if(decorationOrderPO.getQuotationTimeLimit() >= SystemConfig.getInt("quotationTimeLimit")){
				throw new FLException(200018, "报价复制次数达到上线");
			}else{
				decorationOrderPO.setQuotationTimeLimit(decorationOrderPO.getQuotationTimeLimit() + 1);
				decorationOrderDao.update(decorationOrderPO);
			}
			
			BeanUtil.copyProperties(quotationVO, quotationPO);
			
			quotationPO.setDecorationOrder(decorationOrderPO);
			quotationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			
			QuotationPO copyQuotationPO = quotationDao.get(replicaAutoId);
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
				deleteQuotationById(defaultQuotationPO.getAutoId());
			}
			
			quotationPO.setStatus(1); // 设置复制报价为默认报价
			
			quotationDao.save(quotationPO);
			
			copyQuotationDetail(replicaAutoId, quotationPO.getAutoId());
			
			if(status.contains(decorationOrderPO.getStatus())){
				decorationOrderPO.setStatus("已报价");
				decorationOrderDao.saveOrUpdate(decorationOrderPO);
			}
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int copyQuotation(long copyAutoId, QuotationVO quotationVO) throws FLException{
		
		String orderId = quotationVO.getOrderId();
		
		QuotationPO quotationPO = new QuotationPO();

		if(queryQuotationForStatusByOrderId(quotationVO, null) > 0){
			
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
			
			BeanUtil.copyProperties(quotationVO, quotationPO);
			
			quotationPO.setDecorationOrder(decorationOrderPO);
			quotationPO.setCreateUser(new UserPO(quotationVO.getDesignerId()));
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
			
			copyQuotationDetail(copyAutoId,quotationPO.getAutoId());
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteQuotationById(QuotationVO quotationVO) throws FLException{	
		
		Long quotationId = quotationVO.getAutoId();
		
		QuotationPO quotationPO = quotationDao.get(quotationId);
		
		if(queryQuotationForStatusByOrderId(null, quotationPO) > 0){
			
			if(quotationPO.getStatus() == 1){
				throw new FLException(200014, "默认报价不能删除");
			}
			
			deleteQuotationById(quotationId);
			
			return 0;
		}
		
		throw new FLException(200005, "报价不能修改");
	}
	
	@Transactional(rollbackFor=Exception.class)
	private int copyQuotationDetail(long quotationId, long newQuotationId){

		List<QuotationFunctionAreaPO> functionAreas = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationId);
		
		for(QuotationFunctionAreaPO functionAreaPO: functionAreas){
			QuotationFunctionAreaPO quotationFunctionAreaPO = new QuotationFunctionAreaPO();
			BeanUtil.copyProperties(functionAreaPO, quotationFunctionAreaPO, Arrays.asList("autoId"));
			quotationFunctionAreaPO.setQuotation(new QuotationPO(newQuotationId));
			
			List<QuotationFunctionAreaItemPO> quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaId(functionAreaPO.getAutoId());
			List<CustomQuotationItemPO> customQuotationItemPOs = customQuotationItemDao.getAllCustomQuotationItemsByFunctionAreaId(functionAreaPO.getAutoId());
			quotationFunctionAreaDao.save(quotationFunctionAreaPO);
			
			for(QuotationFunctionAreaItemPO quotationFunctionAreaItemPO: quotationFunctionAreaItemPOs){
				QuotationFunctionAreaItemPO _quotationFunctionAreaItemPO  = new QuotationFunctionAreaItemPO();
				BeanUtil.copyProperties(quotationFunctionAreaItemPO, _quotationFunctionAreaItemPO, Arrays.asList("qfaiId", "uuid"));
				
				_quotationFunctionAreaItemPO.setQuotationFunctionArea(quotationFunctionAreaPO);
				_quotationFunctionAreaItemPO.setUuid(UUIDUtil.getUuid());
				
				quotationFunctionAreaItemDao.save(_quotationFunctionAreaItemPO);
			}
			
			String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
			
			for(CustomQuotationItemPO customQuotationItemPO: customQuotationItemPOs){
				
				CustomQuotationItemPO newCustomQuotationItemPO = new CustomQuotationItemPO();
				
				BeanUtil.copyProperties(customQuotationItemPO, newCustomQuotationItemPO, Arrays.asList("autoId"));
				
				int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_CUSTOM_QUOTATION_ITEM_INT, currentDate);
				String itemId = currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "000000");
				newCustomQuotationItemPO.setItemId(itemId);
				
				newCustomQuotationItemPO.setQuotationFunctionArea(quotationFunctionAreaPO);
				
				customQuotationItemDao.save(newCustomQuotationItemPO);
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
				
				quotationFunctionAreaItemPO.setQuotationItem(new QuotationItemPO(functionAreaItemPO.getQuotationItem().getAutoId()));
				quotationFunctionAreaItemPO.setUuid(UUIDUtil.getUuid());
				quotationFunctionAreaItemDao.save(quotationFunctionAreaItemPO);
			}
		}
		
		return 0;
	}
	
	@Transactional(rollbackFor=Exception.class)
	private int deleteQuotationById(long quotationId){
		
		List<QuotationFunctionAreaPO> functionAreas = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationId);
		
		for(QuotationFunctionAreaPO functionAreaPO: functionAreas){
			
			quotationFunctionAreaItemDao.deleteQuotationFunctionAreaItemByFunctionAreaId(functionAreaPO.getAutoId()); // 删除报价项
			customQuotationItemDao.deleteCustomQuotationItemByFunctionAreaId(functionAreaPO.getAutoId()); // 删除自定义报价项
			quotationFunctionAreaDao.deleteById(functionAreaPO.getAutoId()); // 删除功能区
		}
		
		quotationDao.deleteById(quotationId); // 删除报价
		
		return 0;
	}

}
