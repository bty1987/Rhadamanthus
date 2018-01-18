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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.ExtensionDao;
import com.fanglin.quotation.dao.ExtensionItemDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.po.ExtensionPO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.QuotationService;
import com.fanglin.quotation.vo.QuotationVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;


@Service("quotationService")
@Transactional(readOnly=true)
public class QuotationServiceImpl implements QuotationService {

	@Autowired
	private QuotationDao quotationDao;
	
	@Autowired
	private DecorationDao decorationDao;
	
	@Autowired
	private QuotationFunctionAreaItemDao quotationFunctionAreaItemDao;
	
	@Autowired
	private QuotationFunctionAreaDao quotationFunctionAreaDao;
	
	@Autowired
	private ExtensionDao extensionDao;
	
	@Autowired
	private SystemConfigDao systemConfigDao;
	
	@Autowired
	private ExtensionItemDao extensionItemDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public QuotationVO queryQuotationById(long qId){
		QuotationPO quotationPO = quotationDao.get(qId);
		QuotationVO quotationVO = new QuotationVO();
		handleQuotation(quotationVO,quotationPO);
		return quotationVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public QuotationVO queryQuotationForDefaultByOrderId(QuotationVO quotationVO){
		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(quotationVO.getOrderId());
		handleQuotation(quotationVO,quotationPO);
		return quotationVO;
	}
	
	@Override
	public int checkQuotationForStatusByOrderId(QuotationVO quotationVO, QuotationPO quotationPO, boolean priceFlag) throws FLException{
		
		DecorationPO decorationPO = null;
		
		if(quotationVO != null){
			decorationPO = decorationDao.queryDecorationByOrderId(quotationVO.getOrderId());
		}else if(quotationPO != null){
			decorationPO = quotationPO.getDecoration();
		}
		
		List<String> status = Arrays.asList(new String[]{DecorationPO.STATUS_INIT_STR, DecorationPO.STATUS_QUOTATION_STR, DecorationPO.STATUS_DEPOSIT_STR, DecorationPO.STATUS_RESIGNED_STR});
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		if(!status.contains(decorationPO.getStatus())){
			throw new FLException(200005, "报价不能修改");
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<QuotationVO> queryQuotationByOrderId(QuotationVO quotationVO){
		List<QuotationVO> quotationVOs = new ArrayList<QuotationVO>();
		
		List<QuotationPO> quotationPOs = quotationDao.queryQuotationByOrderId(quotationVO.getOrderId());
		
		for(QuotationPO quotationPO: quotationPOs){
			QuotationVO _quotationVO = new QuotationVO();
			
			DecorationPO decorationPO = quotationPO.getDecoration();
			UserPO createUser = quotationPO.getCreateUser();
			
			BeanUtil.copyProperties(quotationPO, _quotationVO);
			
			_quotationVO.setCreaterId(createUser.getUserId());
			_quotationVO.setCreaterName(createUser.getCurrentName());
			_quotationVO.setOrderId(decorationPO.getOrderId());
			_quotationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			quotationVO.setNotSalesmanRate(decorationPO.getNotSalesmanRate());
			
			quotationVO.setVersionId(decorationPO.getVersion().getVersionId());
			
			quotationVOs.add(_quotationVO);
		}
		
		return quotationVOs;
	}
	
	@Override
	public Map<String, List<String>> queryQuotationForConfig(int company) {
		
		Map<String, List<String>> config = new HashMap<String, List<String>>();
		
		config.put("manageRates", Arrays.asList(systemConfigDao.querySystemConfig("manageRate", company).getValue().split(",")));
		config.put("trafficRates", Arrays.asList(systemConfigDao.querySystemConfig("trafficRate", company).getValue().split(",")));
		
	
		/*config.put("manageRates", Arrays.asList(SystemConfig.getString("manageRate").split(",")));
		config.put("trafficRates", Arrays.asList(SystemConfig.getString("trafficRate").split(",")));*/
		
		return config;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addQuotation(QuotationVO quotationVO, String userId) throws FLException{
		List<String> status = Arrays.asList(new String[]{DecorationPO.STATUS_INIT_STR});
		
		String orderId = quotationVO.getOrderId();
		
		QuotationPO quotationPO = new QuotationPO();
		
		if(quotationDao.countQuotationByOrderId(orderId) >= Integer.parseInt(systemConfigDao.querySystemConfig("limitQuotationNumber").getValue())){
			throw new FLException(200001, "报价已经达到数量上限");
		}
		
		checkQuotationForStatusByOrderId(quotationVO, null, false);
		
		BeanUtil.copyProperties(quotationVO, quotationPO);
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		QuotationVersionPO quotationVersionPO = decorationPO.getVersion();
		
		if(quotationVersionPO == null){
			throw new FLException(200022, "报价版本不存在");
		}
		
		quotationPO.setDecoration(decorationPO);
		quotationPO.setCreateUser(userDao.queryUserByUserId(userId));
		quotationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		quotationPO.setSaveStatus(1);
		quotationPO.setDiscount(10);
		
		QuotationPO defaultQuotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);
		if(defaultQuotationPO == null){
			quotationPO.setStatus(1);
		}else{
			quotationPO.setStatus(0);
		}
		
		if(status.contains(decorationPO.getStatus())){
			decorationPO.setStatus(DecorationPO.STATUS_QUOTATION_STR);
			decorationDao.saveOrUpdate(decorationPO);
		}
		
		quotationDao.save(quotationPO);
		
	
		QuotationFunctionAreaPO autogeneration = new QuotationFunctionAreaPO(quotationPO, "生成项目", 9999, (short) 0);
		
		quotationFunctionAreaDao.save(autogeneration);
		
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());
		
		QuotationFunctionAreaItemPO trafficPrice = QuotationFunctionAreaItemPO.factoryToInstance(autogeneration.getQfaId(), divisor);
		convertQuotationPOForAdvance(trafficPrice,"车运费", "", "其他", quotationVersionPO.getTrafficRate(),"0" ,0f, (short) 2, quotationVersionPO.getTrafficDiscount(), autogeneration, "",(short)0);
		QuotationFunctionAreaItemPO managePrice = QuotationFunctionAreaItemPO.factoryToInstance(autogeneration.getQfaId(), divisor);
		convertQuotationPOForAdvance(managePrice,"管理费", "", "其他", quotationVersionPO.getManageRate(),"0" ,0f, (short) 3, quotationVersionPO.getManageDiscount(), autogeneration, "",(short)0);
		quotationFunctionAreaItemDao.save(trafficPrice);
		quotationFunctionAreaItemDao.save(managePrice);
	
		
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
		quotationPO.setContent(quotationVO.getContent());
		
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
	public int updateQuotationForAdvance(QuotationVO quotationVO) throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationVO.getQid());
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		checkQuotationForStatusByOrderId(null, quotationPO, false);
		
		convertQuotationVOToPOForAdvance(quotationVO, quotationPO);
		handleDecorationForTotalPrice(quotationPO);
		quotationDao.update(quotationPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int replicaQuotation(QuotationVO quotationVO) throws FLException{
		
		long replicaQId = quotationVO.getQid();
		
		List<String> status = Arrays.asList(new String[]{DecorationPO.STATUS_INIT_STR});
		
		QuotationPO quotationPO = new QuotationPO();
		
		String orderId = quotationVO.getOrderId();
		
		checkQuotationForStatusByOrderId(quotationVO, null, false);
		
		QuotationPO copyQuotationPO = quotationDao.get(replicaQId);
		
		if(copyQuotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		if(quotationDao.countQuotationByOrderId(orderId) >= Integer.parseInt(systemConfigDao.querySystemConfig("limitQuotationNumber").getValue())){
			throw new FLException(200001, "报价已经达到数量上限");
		}
		
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(decorationPO.getQuotationTimeLimit() >= Integer.parseInt(systemConfigDao.querySystemConfig("quotationTimeLimit").getValue())){
			throw new FLException(200018, "报价复制次数达到上线");
		}else{
			decorationPO.setQuotationTimeLimit(decorationPO.getQuotationTimeLimit() + 1);
			decorationDao.update(decorationPO);
		}
		
		BeanUtil.copyProperties(quotationVO, quotationPO, Arrays.asList("qid"));
		
		quotationPO.setDecoration(decorationPO);
		quotationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		quotationPO.setQuotationName(copyQuotationPO.getQuotationName());
		quotationPO.setDecorationStyle(copyQuotationPO.getDecorationStyle());
		quotationPO.setSaveStatus(1);
		quotationPO.setDiscount(10);
		quotationPO.setTotalPrice(0);
		quotationPO.setCreateUser(copyQuotationPO.getCreateUser());
		quotationPO.setContent("");
		
		
		if(orderId.equals(copyQuotationPO.getDecoration().getOrderId())){
			throw new FLException(200019, "拷贝报价不能在订单内完成");
		}
		
		if(!decorationPO.getVersion().getVersionId().equals(copyQuotationPO.getDecoration().getVersion().getVersionId())){
			throw new FLException(200002, "复制报价与当前报价版本不同,不能拷贝");
		}
		
		QuotationPO defaultQuotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);
		
		if(defaultQuotationPO != null){
			deleteQuotationByQId(defaultQuotationPO.getQid(),orderId);
		}
		
		quotationPO.setStatus(1); // 设置复制报价为默认报价
		
		quotationDao.save(quotationPO);
		
		copyQuotation(replicaQId, quotationPO.getQid());
		
		if(status.contains(decorationPO.getStatus())){
			decorationPO.setStatus("已报价");
			decorationDao.saveOrUpdate(decorationPO);
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int copyQuotation(QuotationVO quotationVO, String userId) throws FLException{
		
		long copyQId = quotationVO.getQid();
		String orderId = quotationVO.getOrderId();
		
		QuotationPO quotationPO = new QuotationPO();

		checkQuotationForStatusByOrderId(quotationVO, null, false);
		
		QuotationPO copyQuotationPO = quotationDao.get(copyQId);
		
		if(copyQuotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
	
		if(quotationDao.countQuotationByOrderId(orderId) >= Integer.parseInt(systemConfigDao.querySystemConfig("limitQuotationNumber").getValue())){
			throw new FLException(200001, "报价已经达到数量上限");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
		
		if(decorationPO.getQuotationTimeLimit() >= Integer.parseInt(systemConfigDao.querySystemConfig("quotationTimeLimit").getValue())){
			throw new FLException(200018, "报价复制次数达到上线");
		}else{
			decorationPO.setQuotationTimeLimit(decorationPO.getQuotationTimeLimit() + 1);
			decorationDao.update(decorationPO);
		}
		
		BeanUtil.copyProperties(quotationVO, quotationPO, Arrays.asList("qid"));
		quotationPO.setDecoration(decorationPO);
		quotationPO.setCreateUser(userDao.queryUserByUserId(userId));
		quotationPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		QuotationPO copyPO = quotationDao.get(copyQId);
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
		
		copyQuotation(copyQId, quotationPO.getQid());
		
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
		
		deleteQuotationByQId(qId,quotationPO.getDecoration().getOrderId());
		
		return 0;
	}
	
	@Transactional(rollbackFor=Exception.class)
	private int copyQuotation(long quotationId, long newQuotationId)throws FLException{

		List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationId);
		
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());
		
		for(QuotationFunctionAreaPO quotationFunctionAreaPO: quotationFunctionAreaPOs){
			
			QuotationFunctionAreaPO _quotationFunctionAreaPO = new QuotationFunctionAreaPO();
			BeanUtil.copyProperties(quotationFunctionAreaPO, _quotationFunctionAreaPO, Arrays.asList("qfaId"));
			_quotationFunctionAreaPO.setQuotation(new QuotationPO(newQuotationId));		
			
			List<QuotationFunctionAreaItemPO> quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaId(QuotationFunctionAreaItemPO.factoryToClazz(quotationFunctionAreaPO.getQfaId(), divisor),quotationFunctionAreaPO.getQfaId());
			
			quotationFunctionAreaDao.save(_quotationFunctionAreaPO);
			
			for(QuotationFunctionAreaItemPO quotationFunctionAreaItemPO: quotationFunctionAreaItemPOs){
				
				QuotationFunctionAreaItemPO clazz = QuotationFunctionAreaItemPO.factoryToInstance(_quotationFunctionAreaPO.getQfaId(), divisor);

				BeanUtil.copyProperties(quotationFunctionAreaItemPO, clazz, Arrays.asList("qfaiId"));
				clazz.setQuotationFunctionArea(_quotationFunctionAreaPO);
				quotationFunctionAreaItemDao.save(clazz);
			}
		}
		
		return 0;
	}
	
	@Transactional(rollbackFor=Exception.class)
	private int deleteQuotationByQId(long qId,String orderId)throws FLException{
		
		List<QuotationFunctionAreaPO> quotationFunctionAreas = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(qId);
		List<ExtensionPO> extensionPOs = extensionDao.queryExtensionByOrderId(orderId);
		if(extensionPOs != null && extensionPOs.size()>0){
			List<Long> extensionIds =new ArrayList<Long>();
			for (ExtensionPO extensionPO:extensionPOs) {
				extensionIds.add(extensionPO.getEid());
			}
			List<Integer> distincts = extensionItemDao.queryQuotationFunctionAreaIdByEids(extensionIds);
			for(QuotationFunctionAreaPO quotationFunctionAreaPO:quotationFunctionAreas){
				for(int distinct : distincts){
					if(distinct == quotationFunctionAreaPO.getQfaId()){
						throw new FLException(200028, "功能区存在拓展项");
					}
				}
			}
		}
		Integer divisor = Integer.parseInt(systemConfigDao.querySystemConfig("quotationFunctionArea").getValue());
		for(QuotationFunctionAreaPO quotationFunctionAreaPO: quotationFunctionAreas){
			long quotatoinFunctionAreaId = quotationFunctionAreaPO.getQfaId();
			String tableName = QuotationFunctionAreaItemPO.quotationFunctionAreaItemTable(quotationFunctionAreaPO.getQfaId(),divisor);
			quotationFunctionAreaItemDao.deleteQuotationFunctionAreaItemByFunctionAreaId(tableName,quotatoinFunctionAreaId); // 删除报价项
			quotationFunctionAreaDao.deleteById(quotatoinFunctionAreaId); // 删除功能区
		}
		
		quotationDao.deleteById(qId); // 删除报价
		
		return 0;
	}
	
	public static void convertQuotationVOToPOForAdvance(QuotationVO quotationVO, QuotationPO quotationPO){
		quotationPO.setDiscount(quotationVO.getDiscount());
		quotationPO.setTotalPrice(quotationVO.getTotalPrice());
		quotationPO.setManagePrice(quotationVO.getManagePrice());
		quotationPO.setManageRate(quotationVO.getManageRate());
		quotationPO.setTrafficPrice(quotationVO.getTrafficPrice());
		quotationPO.setUndisPrice(quotationVO.getUndisPrice());
		quotationPO.setTrafficRate(quotationVO.getTrafficRate());
		quotationPO.setDisPrice(quotationVO.getDisPrice());
	}
	
	private void convertQuotationPOForAdvance(QuotationFunctionAreaItemPO quotationFunctionAreaItemPO,String itemName, String measurementUnit, String workType, float unitPrice, String formula ,float num, short type, short discount, QuotationFunctionAreaPO quotationFunctionArea, String content,short subtype){
		quotationFunctionAreaItemPO.setItemName(itemName);
		quotationFunctionAreaItemPO.setMeasurementUnit(measurementUnit);
		quotationFunctionAreaItemPO.setWorkType(workType);
		quotationFunctionAreaItemPO.setUnitPrice(unitPrice);
		quotationFunctionAreaItemPO.setFormula(formula);
		quotationFunctionAreaItemPO.setNum(num);
		quotationFunctionAreaItemPO.setType(type);
		quotationFunctionAreaItemPO.setDiscount(discount);
		quotationFunctionAreaItemPO.setQuotationFunctionArea(quotationFunctionArea);
		quotationFunctionAreaItemPO.setContent(content);
		quotationFunctionAreaItemPO.setSubtype(subtype);
	}
	
	private void handleDecorationForTotalPrice(QuotationPO quotationPO){
		DecorationPO decorationPO = decorationDao.get(quotationPO.getDecoration().getOrderId());
		decorationPO.setQuotationPrice(quotationPO.getTotalPrice());
		decorationDao.update(decorationPO);
	}
	
	private void  handleQuotation(QuotationVO quotationVO,QuotationPO quotationPO){
		if(quotationPO != null){
			
			DecorationPO decorationPO = quotationPO.getDecoration();
			UserPO createUser = quotationPO.getCreateUser();
			
			BeanUtil.copyProperties(quotationPO, quotationVO);

			quotationVO.setCreaterId(createUser.getUserId());
			quotationVO.setCreaterName(createUser.getCurrentName());
			quotationVO.setOrderId(decorationPO.getOrderId());
			quotationVO.setOrderAddr(String.format("%s %s", decorationPO.getHouse().getVillage().getName(), decorationPO.getHouse().getHouseNumber()));
			quotationVO.setCustomerName(decorationPO.getCustomer().getName());
			quotationVO.setDesignerName(decorationPO.getDesigner().getCurrentName());
			quotationVO.setDesignDepartmentName(decorationPO.getDesigner().getDept().getDeptName());
			quotationVO.setHouseArea(decorationPO.getHouse().getBuildArea());
			quotationVO.setOrderTotalPrice(decorationPO.getOrderTotalPrice());
			quotationVO.setNotSalesmanRate(decorationPO.getNotSalesmanRate());
			
			quotationVO.setVersionId(decorationPO.getVersion().getVersionId());
			
			if(decorationPO.getSupervisor() != null){
				quotationVO.setSupervisorName(decorationPO.getSupervisor().getCurrentName());
			}
		}
	}
}
