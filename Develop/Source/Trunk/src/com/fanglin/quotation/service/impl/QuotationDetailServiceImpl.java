package com.fanglin.quotation.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.po.MeasurementUnitPO;
import com.fanglin.common.po.WorkTypePO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.service.VillageService;
import com.fanglin.data.vo.CustomerVO;
import com.fanglin.data.vo.VillageVO;
import com.fanglin.decoration.dao.AddOrReduceDetailDao;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.AddOrReduceDetailPO;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.service.AddReduceService;
import com.fanglin.decoration.vo.AddReduceVO;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.CustomQuotationItemDao;
import com.fanglin.quotation.dao.FunctionAreaDao;
import com.fanglin.quotation.dao.FunctionAreaItemDao;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaDao;
import com.fanglin.quotation.dao.QuotationFunctionAreaItemDao;
import com.fanglin.quotation.dao.QuotationItemDao;
import com.fanglin.quotation.po.CustomQuotationItemPO;
import com.fanglin.quotation.po.FunctionAreaItemPO;
import com.fanglin.quotation.po.FunctionAreaPO;
import com.fanglin.quotation.po.QuotationBigCategoryPO;
import com.fanglin.quotation.po.QuotationClassificationPO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationItemPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.service.QuotationDetailService;
import com.fanglin.quotation.vo.CustomQuotationItemVO;
import com.fanglin.quotation.vo.QuotationDetailVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaItemVO;
import com.fanglin.quotation.vo.QuotationFunctionAreaVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.SystemConfig;
import com.fanglin.utils.UUIDUtil;

@Service("quotationDetailService")
@Transactional(readOnly = true)
public class QuotationDetailServiceImpl implements QuotationDetailService {
	
	protected Logger log = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private CountingService countingService;

	@Autowired
	private QuotationDao quotationDao;
	
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
	
	@Autowired
	private QuotationItemDao quotationItemDao;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private VillageService villageService;

	@Autowired
	private AddReduceService addReduceService;
	
	@Autowired
	private AddOrReduceDetailDao addOrReduceDetailDao;
	
	@Override
	public List<QuotationFunctionAreaVO> queryQuotationFunctionAreaByIds(List<Long> functionAreaAutoIds){
		List<QuotationFunctionAreaVO> quotationFunctionAreaVOs = new ArrayList<QuotationFunctionAreaVO>();
		
		for(long functionAreaAutoId: functionAreaAutoIds){
		    FunctionAreaPO functionAreaPO = functionAreaDao.get(functionAreaAutoId);
			QuotationFunctionAreaVO quotationFunctionAreaVO = new QuotationFunctionAreaVO();
			
			quotationFunctionAreaVO.setFunctionAreaName(functionAreaPO.getFunctionAreaName());
			quotationFunctionAreaVO.setFunctionAreaOrder(functionAreaPO.getFunctionAreaOrder());
			quotationFunctionAreaVO.setFunctionAreaType(functionAreaPO.getFunctionAreaType());
			
			List<FunctionAreaItemPO> functionAreaItemPOs = functionAreaItemDao.queryFunctionAreaItemByFunctionAreaId(functionAreaAutoId);
			List<QuotationFunctionAreaItemVO> quotationFunctionAreaItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();
			
			for(FunctionAreaItemPO functionAreaItemPO: functionAreaItemPOs){ // 报价项
				QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = new QuotationFunctionAreaItemVO();
				
				QuotationItemPO quotationItemPO = functionAreaItemPO.getQuotationItem();
				
				quotationFunctionAreaItemVO.setItemIdAutoId(quotationItemPO.getAutoId());
				quotationFunctionAreaItemVO.setItemId(quotationItemPO.getItemId());
				quotationFunctionAreaItemVO.setItemName(quotationItemPO.getItemName());
				quotationFunctionAreaItemVO.setMeasurementUnit(quotationItemPO.getMeasurementUnit().getName());
				quotationFunctionAreaItemVO.setMeasurementUnitId(quotationItemPO.getMeasurementUnit().getId());
				
				quotationFunctionAreaItemVO.setQuotationBigCategory(quotationItemPO.getQuotationBigCategory().getName());
				quotationFunctionAreaItemVO.setQuotationBigCategoryId(quotationItemPO.getQuotationBigCategory().getId());
				quotationFunctionAreaItemVO.setQuotationItemDes(quotationItemPO.getQuotationItemDes());
				quotationFunctionAreaItemVO.setUnitPrice(quotationItemPO.getUnitPrice());
				quotationFunctionAreaItemVO.setWorkType(quotationItemPO.getWorkType().getName());
				quotationFunctionAreaItemVO.setWorkTypeId(quotationItemPO.getWorkType().getId());
				
				quotationFunctionAreaItemVO.setQuotationClassification(quotationItemPO.getQuotationClassification().getName());
				quotationFunctionAreaItemVO.setQuotationClassificationId(quotationItemPO.getQuotationClassification().getId());
				
				quotationFunctionAreaItemVO.setNum((float) 0);
				quotationFunctionAreaItemVO.setCustomFlag(0);
				
				quotationFunctionAreaItemVO.setFunctionAreaId(quotationFunctionAreaVO.getAutoId());
				quotationFunctionAreaItemVO.setFunctionAreaName(quotationFunctionAreaVO.getFunctionAreaName());
				
				quotationFunctionAreaItemVOs.add(quotationFunctionAreaItemVO);
			}
			
			quotationFunctionAreaVO.setItems(quotationFunctionAreaItemVOs);
			
			quotationFunctionAreaVOs.add(quotationFunctionAreaVO);
		}
		
		return quotationFunctionAreaVOs;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<QuotationFunctionAreaVO> queryQuotationFunctionAreaForCommonById(Long quotationId){
		List<QuotationFunctionAreaVO> quotationFunctionAreaVOs = new ArrayList<QuotationFunctionAreaVO>();
		List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationId);
		
		for(QuotationFunctionAreaPO quotationFunctionAreaPO: quotationFunctionAreaPOs){
			QuotationFunctionAreaVO quotationFunctionAreaVO = new QuotationFunctionAreaVO();
			BeanUtil.copyProperties(quotationFunctionAreaPO, quotationFunctionAreaVO);
			
			quotationFunctionAreaVOs.add(quotationFunctionAreaVO);
		}
		
		return quotationFunctionAreaVOs;
	}
	
	@Override
	public QuotationDetailVO queryQuotationDetailById(Long autoId) throws FLException{
		QuotationPO quotationPO = quotationDao.get(autoId);
		
		return queryQuotationDetail(quotationPO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public QuotationDetailVO queryQuotationDetailForAllInfoById(Long autoId) throws FLException{
		
		QuotationPO quotationPO = quotationDao.get(autoId);
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		QuotationDetailVO quotationDetailVO =  queryQuotationDetail(quotationPO);
		List<QuotationFunctionAreaItemVO> addOrReduceitems = new ArrayList<QuotationFunctionAreaItemVO>();
		
		if(quotationPO.getStatus() == 1){ // 默认报价项
			List<AddReduceVO> addReduceVOs = addReduceService.queryAddReduceByOrderId(quotationPO.getDecorationOrder().getOrderId());
			
			if(addReduceVOs != null && addReduceVOs.size() != 0){
				for(AddReduceVO addReduceVO: addReduceVOs){
					List<AddOrReduceDetailPO> addOrReduceDetailPOs = addOrReduceDetailDao.queryAddOrReduceDetailById(addReduceVO.getArId());
					
					if(addOrReduceDetailPOs != null && addOrReduceDetailPOs.size() != 0){
						for(AddOrReduceDetailPO addOrReduceDetailPO: addOrReduceDetailPOs){
							QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = new QuotationFunctionAreaItemVO();
							BeanUtil.copyProperties(addOrReduceDetailPO, quotationFunctionAreaItemVO,Arrays.asList("itemType"));
							quotationFunctionAreaItemVO.setFunctionAreaId(addOrReduceDetailPO.getQuotationFunctionAreaPO().getAutoId());
							quotationFunctionAreaItemVO.setFunctionAreaName(addOrReduceDetailPO.getQuotationFunctionAreaPO().getFunctionAreaName());
							quotationFunctionAreaItemVO.setQuotationBigCategory(addOrReduceDetailPO.getQuotationBigCategoryPO().getName());
							quotationFunctionAreaItemVO.setQuotationBigCategoryId(addOrReduceDetailPO.getQuotationBigCategoryPO().getId());
							quotationFunctionAreaItemVO.setQuotationClassification(addOrReduceDetailPO.getQuotationClassificationPO().getName());
							quotationFunctionAreaItemVO.setQuotationClassificationId(addOrReduceDetailPO.getQuotationClassificationPO().getId());
							quotationFunctionAreaItemVO.setMeasurementUnit(addOrReduceDetailPO.getMeasurementUnitPO().getName());
							quotationFunctionAreaItemVO.setMeasurementUnitId(addOrReduceDetailPO.getMeasurementUnitPO().getId());
							quotationFunctionAreaItemVO.setWorkType(addOrReduceDetailPO.getWorkTypePO().getName());
							quotationFunctionAreaItemVO.setWorkTypeId(addOrReduceDetailPO.getWorkTypePO().getId());
							quotationFunctionAreaItemVO.setUnitPrice(addOrReduceDetailPO.getUnitPrice());
							quotationFunctionAreaItemVO.setItemId(addOrReduceDetailPO.getCustomerItemId());
							quotationFunctionAreaItemVO.setItemName(addOrReduceDetailPO.getItemName());
							
							if(addReduceVO.getAddReduceType() == 1){
								quotationFunctionAreaItemVO.setNum(0 - addOrReduceDetailPO.getNum());
								quotationFunctionAreaItemVO.setItemType(QuotationFunctionAreaItemPO.TYPE_REDUCE_STR);
							}else{
								quotationFunctionAreaItemVO.setItemType(QuotationFunctionAreaItemPO.TYPE_ADD_STR);
								quotationFunctionAreaItemVO.setNum(addOrReduceDetailPO.getNum());
							}
							addOrReduceitems.add(quotationFunctionAreaItemVO);
						}
					}	
				}
			}
		}
		
		quotationDetailVO.setOtherItems(addOrReduceitems);
		
		return quotationDetailVO;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public QuotationDetailVO queryQuotationDetailForDefaultByOrderId(String decorationOrderId) throws FLException{
		
		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(decorationOrderId);
		
		return queryQuotationDetail(quotationPO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addQuotationFuctionArea(List<QuotationFunctionAreaVO> quotationFunctionAreaVOs, QuotationDetailVO quotationDetailVO) throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationDetailVO.getAutoId());
		
		if(quotationPO != null){
			
			quotationDetailVOToQuotationPO(quotationDetailVO, quotationPO);
			
			for(QuotationFunctionAreaVO quotationFunctionAreaVO: quotationFunctionAreaVOs){
			
				QuotationFunctionAreaPO quotationFunctionAreaPO = new QuotationFunctionAreaPO();
				quotationFunctionAreaPO.setQuotation(quotationPO);
				quotationFunctionAreaPO.setFunctionAreaName(quotationFunctionAreaVO.getFunctionAreaName());
				quotationFunctionAreaPO.setFunctionAreaOrder(quotationFunctionAreaVO.getFunctionAreaOrder());
				quotationFunctionAreaPO.setFunctionAreaType(quotationFunctionAreaVO.getFunctionAreaType());
				
				quotationFunctionAreaDao.saveOrUpdate(quotationFunctionAreaPO);
				
				quotationFunctionAreaVO.setAutoId(quotationFunctionAreaPO.getAutoId());
			}
			
			quotationDao.update(quotationPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<QuotationFunctionAreaVO> addQuotationFuctionAreaByIds(List<Long> functionAreaAutoIds, QuotationDetailVO quotationDetailVO) throws FLException {
		
		List<QuotationFunctionAreaVO> quotationFunctionAreaVOs = new ArrayList<QuotationFunctionAreaVO>();
		
		QuotationPO quotationPO = quotationDao.get(quotationDetailVO.getAutoId());
		
		if(quotationPO != null){
			
			quotationDetailVOToQuotationPO(quotationDetailVO, quotationPO);
			
			for(long functionAreaAutoId: functionAreaAutoIds){
			    FunctionAreaPO functionAreaPO = functionAreaDao.get(functionAreaAutoId);
				QuotationFunctionAreaVO quotationFunctionAreaVO = new QuotationFunctionAreaVO();
				
				quotationFunctionAreaVO.setFunctionAreaName(functionAreaPO.getFunctionAreaName());
				quotationFunctionAreaVO.setFunctionAreaOrder(functionAreaPO.getFunctionAreaOrder());
				quotationFunctionAreaVO.setFunctionAreaType(functionAreaPO.getFunctionAreaType());
				
				QuotationFunctionAreaPO quotationFunctionAreaPO = new QuotationFunctionAreaPO();
				quotationFunctionAreaPO.setQuotation(quotationPO);
				quotationFunctionAreaPO.setFunctionAreaName(quotationFunctionAreaVO.getFunctionAreaName());
				quotationFunctionAreaPO.setFunctionAreaOrder(quotationFunctionAreaVO.getFunctionAreaOrder());
				quotationFunctionAreaPO.setFunctionAreaType(quotationFunctionAreaVO.getFunctionAreaType());
				
				quotationFunctionAreaDao.saveOrUpdate(quotationFunctionAreaPO);
				
				List<FunctionAreaItemPO> functionAreaItemPOs = functionAreaItemDao.queryFunctionAreaItemByFunctionAreaId(functionAreaAutoId);
				List<QuotationFunctionAreaItemVO> quotationFunctionAreaItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();
				
				for(FunctionAreaItemPO functionAreaItemPO: functionAreaItemPOs){ // 报价项
					QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = new QuotationFunctionAreaItemVO();
					
					QuotationItemPO quotationItemPO = functionAreaItemPO.getQuotationItem();
					
					quotationFunctionAreaItemVO.setItemIdAutoId(quotationItemPO.getAutoId());
					quotationFunctionAreaItemVO.setItemId(quotationItemPO.getItemId());
					quotationFunctionAreaItemVO.setItemName(quotationItemPO.getItemName());
					quotationFunctionAreaItemVO.setMeasurementUnit(quotationItemPO.getMeasurementUnit().getName());
					quotationFunctionAreaItemVO.setMeasurementUnitId(quotationItemPO.getMeasurementUnit().getId());
					
					quotationFunctionAreaItemVO.setQuotationBigCategory(quotationItemPO.getQuotationBigCategory().getName());
					quotationFunctionAreaItemVO.setQuotationBigCategoryId(quotationItemPO.getQuotationBigCategory().getId());
					quotationFunctionAreaItemVO.setQuotationItemDes(quotationItemPO.getQuotationItemDes());
					quotationFunctionAreaItemVO.setUnitPrice(quotationItemPO.getUnitPrice());
					quotationFunctionAreaItemVO.setWorkType(quotationItemPO.getWorkType().getName());
					quotationFunctionAreaItemVO.setWorkTypeId(quotationItemPO.getWorkType().getId());
					
					quotationFunctionAreaItemVO.setQuotationClassification(quotationItemPO.getQuotationClassification().getName());
					quotationFunctionAreaItemVO.setQuotationClassificationId(quotationItemPO.getQuotationClassification().getId());
					
					quotationFunctionAreaItemVO.setNum((float) 0);
					quotationFunctionAreaItemVO.setCustomFlag(0);
					
					quotationFunctionAreaItemVO.setFunctionAreaId(quotationFunctionAreaVO.getAutoId());
					quotationFunctionAreaItemVO.setFunctionAreaName(quotationFunctionAreaVO.getFunctionAreaName());
					
					quotationFunctionAreaItemVO.setFunctionAreaId(quotationFunctionAreaPO.getAutoId());
					quotationFunctionAreaItemVO.setFunctionAreaName(quotationFunctionAreaPO.getFunctionAreaName());
					
					quotationFunctionAreaItemVOs.add(quotationFunctionAreaItemVO);
				}
				
				quotationFunctionAreaVO.setAutoId(quotationFunctionAreaPO.getAutoId());
				quotationFunctionAreaVO.setItems(quotationFunctionAreaItemVOs);
				
				quotationFunctionAreaVOs.add(quotationFunctionAreaVO);
			}
			
			quotationDao.update(quotationPO);
		}
		
		return quotationFunctionAreaVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addCustomQuotationItem(CustomQuotationItemVO customQuotationItemVO, QuotationDetailVO quotationDetailVO) throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationDetailVO.getAutoId());
		
		if(quotationPO != null){
			
			String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
			
			quotationDetailVOToQuotationPO(quotationDetailVO, quotationPO);
			
			CustomQuotationItemPO customQuotationItemPO = new CustomQuotationItemPO();
			
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_CUSTOM_QUOTATION_ITEM_INT, currentDate);
			customQuotationItemPO.setItemId(currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "000000"));
			
			customQuotationItemPO.setItemName(customQuotationItemVO.getItemName());
			customQuotationItemPO.setMeasurementUnit(new MeasurementUnitPO(customQuotationItemVO.getMeasurementUnitId()));
			customQuotationItemPO.setNum(customQuotationItemVO.getNum());
			customQuotationItemPO.setQuotationBigCategory(new QuotationBigCategoryPO(customQuotationItemVO.getQuotationBigCategoryId()));
			
			if(QuotationClassificationPO.TYPE_DISPOSABLE_STR.equals(customQuotationItemVO.getFunctionAreaType())){
				customQuotationItemPO.setQuotationClassification(new QuotationClassificationPO(QuotationClassificationPO.TYPE_DISPOSABLE_INT)); // 一次性包死
			}else if(QuotationClassificationPO.TYPE_MANAGEMENT_EXPENSE_STR.equals(customQuotationItemVO.getFunctionAreaType())){
				customQuotationItemPO.setQuotationClassification(new QuotationClassificationPO(QuotationClassificationPO.TYPE_MANAGEMENT_EXPENSE_INT)); // 管理费
			}else if(QuotationClassificationPO.TYPE_INTEGRATED_PROJECT_STR.equals(customQuotationItemVO.getFunctionAreaType())){
				customQuotationItemPO.setQuotationClassification(new QuotationClassificationPO(QuotationClassificationPO.TYPE_INTEGRATED_PROJECT_INT)); // 综合项目
			}else{
				customQuotationItemPO.setQuotationClassification(new QuotationClassificationPO(QuotationClassificationPO.TYPE_OTHER_PART_INT)); // 其他部分
			}
			customQuotationItemPO.setQuotationFunctionArea(new QuotationFunctionAreaPO(customQuotationItemVO.getFunctionAreaId()));
			customQuotationItemPO.setQuotationItemDes(customQuotationItemVO.getQuotationItemDes());
			customQuotationItemPO.setUnitPrice(customQuotationItemVO.getUnitPrice());
			customQuotationItemPO.setWorkType(new WorkTypePO(customQuotationItemVO.getWorkTypeId()));
			
			customQuotationItemDao.saveOrUpdate(customQuotationItemPO);
			
			customQuotationItemVO.setAutoId(customQuotationItemPO.getAutoId());
			
			quotationDao.update(quotationPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveQuotationDetail(QuotationDetailVO quotationDetailVO) throws FLException{
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(quotationDetailVO.getOrderId());
		
		if(DecorationOrderPO.STATUS_SIGNED_STR.equals(decorationOrderPO.getStatus())){
			throw new FLException(200005, "报价不能修改");
		}
		
		QuotationPO quotationPO = quotationDao.get(quotationDetailVO.getAutoId());
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		quotationPO.setDiscount(quotationDetailVO.getDiscount());
		quotationPO.setTotalPrice(quotationDetailVO.getTotalPrice());
		quotationPO.setLatexCut(quotationDetailVO.getLatexCut());
		quotationPO.setManagePrice(quotationDetailVO.getManagePrice());
		quotationPO.setManageRate(quotationDetailVO.getManageRate());
		quotationPO.setTrafficPrice(quotationDetailVO.getTrafficPrice());
		
		quotationDao.update(quotationPO);
		
		updateQuotationFunctionArea(quotationDetailVO); // 更新报价详细信息
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotatoin(QuotationDetailVO quotationDetailVO) throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationDetailVO.getAutoId());
		
		if(quotationPO != null){
			quotationDetailVOToQuotationPO(quotationDetailVO, quotationPO);
			
			quotationDao.update(quotationPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotationFunctionArea(QuotationFunctionAreaVO quotationFunctionAreaVO, QuotationDetailVO quotationDetailVO) throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationDetailVO.getAutoId());
		
		if(quotationPO != null){
			quotationDetailVOToQuotationPO(quotationDetailVO, quotationPO);
			
			QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(quotationFunctionAreaVO.getAutoId());
			
			if(quotationFunctionAreaPO != null){
				quotationFunctionAreaPO.setFunctionAreaName(quotationFunctionAreaVO.getFunctionAreaName());
				quotationFunctionAreaPO.setFunctionAreaOrder(quotationFunctionAreaVO.getFunctionAreaOrder());
				
				quotationFunctionAreaDao.update(quotationFunctionAreaPO);
			}
			
			quotationDao.update(quotationPO);
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateQuotationFunctionAreaItem(QuotationFunctionAreaItemVO quotationFunctionAreaItemVO, QuotationDetailVO quotationDetailVO) throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationDetailVO.getAutoId());
		
		if(quotationPO != null){
			quotationDetailVOToQuotationPO(quotationDetailVO, quotationPO);
			
			QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = null;
			
			if("".equals(quotationFunctionAreaItemVO.getUuid())){
				
				String uuid = UUIDUtil.getUuid();
				
				quotationFunctionAreaItemPO = new QuotationFunctionAreaItemPO();
				quotationFunctionAreaItemPO.setUuid(uuid);
				quotationFunctionAreaItemPO.setQuotationFunctionArea(new QuotationFunctionAreaPO(quotationFunctionAreaItemVO.getFunctionAreaId()));
				quotationFunctionAreaItemPO.setQuotationItem(new QuotationItemPO(quotationFunctionAreaItemVO.getItemIdAutoId()));
				quotationFunctionAreaItemPO.setNum(quotationFunctionAreaItemVO.getNum());
				
				quotationFunctionAreaItemVO.setUuid(uuid);
			}else{
				quotationFunctionAreaItemPO = quotationFunctionAreaItemDao.get(quotationFunctionAreaItemVO.getUuid());
				
				if(quotationFunctionAreaItemPO != null){
					quotationFunctionAreaItemPO.setNum(quotationFunctionAreaItemVO.getNum());
				}
			}
			
			quotationFunctionAreaItemVO.setQfaiId(quotationFunctionAreaItemPO.getQfaiId());
			
			quotationFunctionAreaItemDao.saveOrUpdate(quotationFunctionAreaItemPO);
			quotationDao.update(quotationPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateCustomQuotationItem(CustomQuotationItemVO customQuotationItemVO, QuotationDetailVO quotationDetailVO) throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationDetailVO.getAutoId());
		
		if(quotationPO != null){
			quotationDetailVOToQuotationPO(quotationDetailVO, quotationPO);
			
			CustomQuotationItemPO customQuotationItemPO = customQuotationItemDao.get(customQuotationItemVO.getAutoId());
			
			customQuotationItemPO.setItemName(customQuotationItemVO.getItemName());
			customQuotationItemPO.setQuotationBigCategory(new QuotationBigCategoryPO(customQuotationItemVO.getQuotationBigCategoryId()));
			customQuotationItemPO.setMeasurementUnit(new MeasurementUnitPO(customQuotationItemVO.getMeasurementUnitId()));
			customQuotationItemPO.setNum(customQuotationItemVO.getNum());
			customQuotationItemPO.setUnitPrice(customQuotationItemVO.getUnitPrice());
			
			customQuotationItemVO.setAutoId(customQuotationItemPO.getAutoId());
			
			customQuotationItemDao.update(customQuotationItemPO);
			
			quotationDao.update(quotationPO);
		}
		
		return 0;
	}

	@Override
	public int countQuotationDetail(QuotationDetailVO quotationDetail){

		List<QuotationFunctionAreaVO> functionAreas = quotationDetail.getFunctionAreas();

		float totalPrice = 0.0f; // 总价
		float normalPrice = 0.0f;//正常价格
		float discountPrice = 0.0f; // 打折
		float noDiscountTotalPrice = 0.0f; // 不打折
		float carManagePrice = 0.0f; // 车运费
		float managePrice = 0.0f; // 管理费
		
		int carManageFunctionAreaIndex = -1;
		int manageFunctionAreaIndex = -1;
		
		quotationDetail.setManageRate(0f);
		quotationDetail.setCarManageRate(0f);
		
		for(int i=0;i<functionAreas.size();i++){
			QuotationFunctionAreaVO quotationFunctionAreaVO = functionAreas.get(i);
			
			quotationFunctionAreaVO.setSum(0f);
			
			if(QuotationFunctionAreaPO.TYPE_COMMON_STR.equals(quotationFunctionAreaVO.getFunctionAreaType())){ // 参与打折
				float sum = 0;
				float preDiscountSum = 0;
				
				if(quotationFunctionAreaVO.getItems() != null){
					
					int quotationFunctionAreaItemLength = quotationFunctionAreaVO.getItems().size();
					
					for(int j=0;j<quotationFunctionAreaItemLength;j++){
						
						QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = quotationFunctionAreaVO.getItems().get(j);
						
						sum += (Arith.round(((quotationFunctionAreaItemVO.getUnitPrice() * quotationDetail.getDiscount() * quotationFunctionAreaItemVO.getNum()) / 10), 2));
						preDiscountSum += (Arith.round(((quotationFunctionAreaItemVO.getUnitPrice() * quotationFunctionAreaItemVO.getNum())), 2));
					}
				}
				
				quotationFunctionAreaVO.setSum(sum);
				normalPrice += preDiscountSum;
				discountPrice += sum;
				totalPrice += sum;
			}else { // 不打折
				float sum = 0;
				
				if(quotationFunctionAreaVO.getItems() != null){
					
					int quotationFunctionAreaItemLength = quotationFunctionAreaVO.getItems().size();
					
					for(int j=0;j<quotationFunctionAreaItemLength;j++){
						
						QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = quotationFunctionAreaVO.getItems().get(j);
						
						if((quotationFunctionAreaItemVO.getItemName().contains("车运费"))){
							carManageFunctionAreaIndex = i;
							quotationDetail.setCarManageRate(quotationFunctionAreaItemVO.getUnitPrice());
						}else if((quotationFunctionAreaItemVO.getItemName().contains("管理费"))){
							manageFunctionAreaIndex = i;
							quotationDetail.setManageRate(quotationFunctionAreaItemVO.getUnitPrice() + quotationDetail.getNotSalesmanRate());
						}else{
							sum += (Arith.round((quotationFunctionAreaItemVO.getUnitPrice() * quotationFunctionAreaItemVO.getNum()), 2));
						}
					}
				}
				quotationFunctionAreaVO.setSum(sum);
				noDiscountTotalPrice += sum;
				totalPrice += sum;
			}
		}
		
		float commonPrice = discountPrice + noDiscountTotalPrice;
		float preDiscountCommonPrice = normalPrice + noDiscountTotalPrice;
		
		carManagePrice = (Arith.round((commonPrice) * quotationDetail.getCarManageRate(), 2));
		if(quotationDetail.getLimitCarManagePrice() > carManagePrice){
			carManagePrice = (Arith.round(quotationDetail.getLimitCarManagePrice(), 2));
		}
		
		if(carManageFunctionAreaIndex != -1){
			preDiscountCommonPrice += carManagePrice;
			functionAreas.get(carManageFunctionAreaIndex).setSum(functionAreas.get(carManageFunctionAreaIndex).getSum() + carManagePrice);
			totalPrice += carManagePrice;
		}
		
		managePrice = Arith.round(((preDiscountCommonPrice) * quotationDetail.getManageRate()), 2);

		if(manageFunctionAreaIndex != -1){
			functionAreas.get(manageFunctionAreaIndex).setSum(functionAreas.get(manageFunctionAreaIndex).getSum() + managePrice);
			totalPrice += managePrice;
		}
		
		quotationDetail.setTotalPrice(Arith.round(totalPrice, 2)); // 总价
		quotationDetail.setDiscount(Arith.round(quotationDetail.getDiscount(), 2)); // 打折
		
		return 0;
	}
	
	@Override
	public int ensurseQuotationDetail(QuotationDetailVO quotationDetailVO){
		
		QuotationPO quotationPO = quotationDao.get(quotationDetailVO.getAutoId());
		DecorationOrderPO decorationOrderPO = quotationPO.getDecorationOrder();
		UserPO createUserPO = quotationPO.getCreateUser();
		
		Assert.isTrue(decorationOrderPO.getOrderId().equals(quotationDetailVO.getOrderId()));
		
		quotationDetailVO.setAutoId(quotationPO.getAutoId());
		quotationDetailVO.setCreateTime(quotationPO.getCreateTime());
		quotationDetailVO.setDecorationStyle(quotationPO.getDecorationStyle());
		
		quotationDetailVO.setContractTime(decorationOrderPO.getContractTime());

		quotationDetailVO.setDesigner(createUserPO.getCurrentName());
		quotationDetailVO.setDesignerId(createUserPO.getUserId());
		quotationDetailVO.setDesignerPhone(createUserPO.getPhone());
		
		CustomerVO customerVO = new CustomerVO();
		BeanUtil.copyProperties(decorationOrderPO.getCustomerPO(), customerVO);
		quotationDetailVO.setCustomer(customerVO);
		quotationDetailVO.setHouseNumber(decorationOrderPO.getHouseNumber());
		
		quotationDetailVO.setOrderId(decorationOrderPO.getOrderId());
		
		if(decorationOrderPO.getNotSalesmanRate() != null){
			quotationDetailVO.setNotSalesmanRate(decorationOrderPO.getNotSalesmanRate());
		}else{
			quotationDetailVO.setNotSalesmanRate(0f);
		}
		
		quotationDetailVO.setQuotationContent(quotationPO.getQuotationContent());
		quotationDetailVO.setQuotationName(quotationPO.getQuotationName());
		quotationDetailVO.setSaveStatus(quotationPO.getSaveStatus());
		quotationDetailVO.setStatus(quotationPO.getStatus());
		
		quotationDetailVO.setOrderStatus(decorationOrderPO.getStatus());
		quotationDetailVO.setVersionId(decorationOrderPO.getVersionPO().getVersionId());
		
		quotationDetailVO.setLimitCarManagePrice(SystemConfig.getFloat("limitCarManagePrice"));
		
		List<Long> quotationItemIds = new ArrayList<Long>();
		List<QuotationFunctionAreaVO> functionAreas = quotationDetailVO.getFunctionAreas();
		List<QuotationFunctionAreaItemVO> quotationFunctionAreaItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();
		
		if(functionAreas == null){
			return 0;
		}
		
		int functionAreaLength = functionAreas.size();
		for(int i=0;i<functionAreaLength;++i){
			
			QuotationFunctionAreaVO quotationFunctionAreaVO = functionAreas.get(i);
			
			if(quotationFunctionAreaVO.getItems() != null){
				List<QuotationFunctionAreaItemVO> _quotationFunctionAreaItemVOs = quotationFunctionAreaVO.getItems();
				
				int functionAreasLength = _quotationFunctionAreaItemVOs.size();
				for(int j=0;j<functionAreasLength;j++){
					
					QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = _quotationFunctionAreaItemVOs.get(j);
					
					if(quotationFunctionAreaItemVO.getCustomFlag() == 1){
						continue;
					}else{ // 非自定义
						
						long quotationItemId = quotationFunctionAreaItemVO.getItemIdAutoId();
						
						quotationItemIds.add(quotationItemId);
						quotationFunctionAreaItemVOs.add(quotationFunctionAreaItemVO);
					}
				}
			}
		}
		
		List<QuotationItemPO> quotationItemPOs = quotationItemDao.queryQuotationItemByIds(quotationItemIds);
		Map<Long, QuotationItemPO> quotationItemMap = new HashMap<Long, QuotationItemPO>();
		
		
		for(QuotationItemPO quotationItemPO: quotationItemPOs){
			quotationItemMap.put(quotationItemPO.getAutoId(), quotationItemPO);
		}
		
		for(QuotationFunctionAreaItemVO quotationFunctionAreaItemVO: quotationFunctionAreaItemVOs){
			if(quotationItemIds.contains(quotationFunctionAreaItemVO.getItemIdAutoId())){
				
				QuotationItemPO quotationItemPO = quotationItemMap.get(quotationFunctionAreaItemVO.getItemIdAutoId());
				
				quotationFunctionAreaItemVO.setItemId(quotationItemPO.getItemId());
				quotationFunctionAreaItemVO.setItemName(quotationItemPO.getItemName());
				quotationFunctionAreaItemVO.setMeasurementUnitId(quotationItemPO.getMeasurementUnit().getId());
				quotationFunctionAreaItemVO.setQuotationClassificationId(quotationItemPO.getQuotationClassification().getId());
				quotationFunctionAreaItemVO.setQuotationBigCategoryId(quotationItemPO.getQuotationBigCategory().getId());
				quotationFunctionAreaItemVO.setUnitPrice(quotationItemPO.getUnitPrice());
				quotationFunctionAreaItemVO.setWorkTypeId(quotationItemPO.getWorkType().getId());
			}
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteQuotationFunctionArea(QuotationFunctionAreaVO quotationFunctionAreaVO, QuotationDetailVO quotationDetailVO) throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationDetailVO.getAutoId());
		
		if(quotationPO != null){
			
			quotationDetailVOToQuotationPO(quotationDetailVO, quotationPO);
			
			List<Long> ids = Arrays.asList(new Long[]{quotationFunctionAreaVO.getAutoId()});
			
			QuotationFunctionAreaPO quotationFunctionAreaPO = quotationFunctionAreaDao.get(quotationFunctionAreaVO.getAutoId());
			
			if(quotationFunctionAreaPO != null && !QuotationFunctionAreaPO.TYPE_MANAGEMENT_STR.equals(quotationFunctionAreaPO.getFunctionAreaType())){
				quotationFunctionAreaDao.deleteQuotationFunctionAreaByIds(ids);
				quotationFunctionAreaItemDao.deleteQuotationFunctionAreaItemByFunctionAreaId(quotationFunctionAreaVO.getAutoId());
			}
			
			quotationDao.update(quotationPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteQuotationFunctionAreaItemByUuids(List<String> uuids, QuotationDetailVO quotationDetailVO) throws FLException {
		
		QuotationPO quotationPO = quotationDao.get(quotationDetailVO.getAutoId());
		
		if(quotationPO != null){
			
			quotationDetailVOToQuotationPO(quotationDetailVO, quotationPO);
			
			if(uuids != null && uuids.size() > 0){
				quotationFunctionAreaItemDao.deleteQuotationFunctionAreaItemByUuids(uuids);
			}
			
			quotationDao.update(quotationPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteCustomQuotationItemByIds(List<Long> autoIds, QuotationDetailVO quotationDetailVO) {
		
		QuotationPO quotationPO = quotationDao.get(quotationDetailVO.getAutoId());
		
		if(quotationPO != null){
			
			if(autoIds != null && autoIds.size() > 0){
				customQuotationItemDao.deleteCustomQuotationItemByIds(autoIds);
			}
			
			quotationDao.update(quotationPO);
		}
		
		return 0;
	}

	@Transactional(rollbackFor=Exception.class)
	public int updateQuotationFunctionArea(QuotationDetailVO quotationDetailVO){
		
		// 功能区修改
		List<QuotationFunctionAreaVO> functionAreas = quotationDetailVO.getFunctionAreas();
		List<QuotationFunctionAreaPO> oldFunctionAreas = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationDetailVO.getAutoId());

		List<Long> quotationFunctionAreaAutoIds = new ArrayList<Long>(); // 提交功能区autoId集合
		List<String> quotationFunctionAreaItemUuids = new ArrayList<String>(); // 提交报价项uuid集合
		List<String> customQuotationFunctionAreaItemIds = new ArrayList<String>(); // 提交自定义报价项uuid集合
		
		List<Long> oldQuotationFunctionAreaAutoIds = new ArrayList<Long>(); // 旧功能区autoId集合
		List<String> oldQuotationFunctionAreaItemUuids = new ArrayList<String>(); // 旧报价项uuid集合
		List<String> oldCustomQuotationFunctionAreaItemIds = new ArrayList<String>(); // 旧报价项uuid集合
		
		Map<Long, QuotationFunctionAreaVO> quotationFunctionAreas = new HashMap<Long, QuotationFunctionAreaVO>(); // 提交功能区对应auto字典
		Map<String, QuotationFunctionAreaItemVO> quotationFunctionAreaItems = new HashMap<String, QuotationFunctionAreaItemVO>(); // 提交报价项对应uuid字典
		Map<String, QuotationFunctionAreaItemVO> customQuotationFunctionAreaItems = new HashMap<String, QuotationFunctionAreaItemVO>(); // 提交自定义报价项对应uuid字典
		
		Map<Long, QuotationFunctionAreaPO> oldQuotationFunctionAreas = new HashMap<Long, QuotationFunctionAreaPO>(); // 旧功能区对应auto字典
		Map<String, QuotationFunctionAreaItemPO> oldQuotationFunctionAreaItems = new HashMap<String, QuotationFunctionAreaItemPO>(); // 旧报价项对应uuid字典
		Map<String, CustomQuotationItemPO> oldCustomQuotationFunctionAreaItems = new HashMap<String, CustomQuotationItemPO>(); // 旧自定义报价项对应uuid字典
		
		List<QuotationFunctionAreaPO> addQuotationFunctionAreas = new ArrayList<QuotationFunctionAreaPO>();
		List<QuotationFunctionAreaItemPO> addQuotationFunctionAreaItems = new ArrayList<QuotationFunctionAreaItemPO>();
		List<CustomQuotationItemPO> addCustomQuotationFunctionAreaItems = new ArrayList<CustomQuotationItemPO>();
		
		List<QuotationFunctionAreaVO> addQuotationFunctionAreaVOs = new ArrayList<QuotationFunctionAreaVO>();
		List<QuotationFunctionAreaItemVO> addQuotationFunctionAreaItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();
		List<QuotationFunctionAreaItemVO> addCustomQuotationItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();
		
		List<Long> updateQuotationFunctionAreaAutoIds = new ArrayList<Long>();
		List<String> updateQuotationFunctionAreaItemUuids = new ArrayList<String>();
		List<String> updateCustomerQuotationFunctionAreaItemIds = new ArrayList<String>();
		
		List<Long> removeQuotationFunctionAreaAutoIds = new ArrayList<Long>();
		List<String> removeQuotationFunctionAreaItemUuids = new ArrayList<String>();
		List<String> removeCustomerQuotationFunctionAreaItemIds = new ArrayList<String>();
		
		for(QuotationFunctionAreaPO quotationFunctionAreaPO: oldFunctionAreas){
			oldQuotationFunctionAreas.put(quotationFunctionAreaPO.getAutoId(), quotationFunctionAreaPO);
			oldQuotationFunctionAreaAutoIds.add(quotationFunctionAreaPO.getAutoId());
		}
		
		List<QuotationFunctionAreaItemPO> _quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaIds(oldQuotationFunctionAreaAutoIds);
		for(QuotationFunctionAreaItemPO quotationFunctionAreaItemPO: _quotationFunctionAreaItemPOs){
			oldQuotationFunctionAreaItemUuids.add(quotationFunctionAreaItemPO.getUuid());
			oldQuotationFunctionAreaItems.put(quotationFunctionAreaItemPO.getUuid(), quotationFunctionAreaItemPO);
		}
		
		List<CustomQuotationItemPO> _customerQuotationItemPOs = customQuotationItemDao.queryCustomQuotationItemByFunctionAreaIds(oldQuotationFunctionAreaAutoIds);
		for(CustomQuotationItemPO customQuotationItemPO: _customerQuotationItemPOs){
			oldCustomQuotationFunctionAreaItemIds.add(customQuotationItemPO.getItemId());
			oldCustomQuotationFunctionAreaItems.put(customQuotationItemPO.getItemId(), customQuotationItemPO);
		}
		
		for(QuotationFunctionAreaVO quotationFunctionAreaVO: functionAreas){
			
			Long _autoId = quotationFunctionAreaVO.getAutoId();
			QuotationFunctionAreaPO quotationFunctionAreaPO = null;
			
			if(_autoId == null){
				
				quotationFunctionAreaPO = new QuotationFunctionAreaPO();
				quotationFunctionAreaPO.setFunctionAreaName(quotationFunctionAreaVO.getFunctionAreaName());
				quotationFunctionAreaPO.setFunctionAreaOrder(quotationFunctionAreaVO.getFunctionAreaOrder());
				quotationFunctionAreaPO.setFunctionAreaType(quotationFunctionAreaVO.getFunctionAreaType());
				quotationFunctionAreaPO.setQuotation(new QuotationPO(quotationDetailVO.getAutoId()));
				
				addQuotationFunctionAreas.add(quotationFunctionAreaPO);
				addQuotationFunctionAreaVOs.add(quotationFunctionAreaVO);
			}else{
				if(oldQuotationFunctionAreaAutoIds.contains(_autoId)){
					quotationFunctionAreaPO = oldQuotationFunctionAreas.get(_autoId);
					
					quotationFunctionAreaAutoIds.add(_autoId);
					quotationFunctionAreas.put(_autoId, quotationFunctionAreaVO);
				}
			}
			
			List<QuotationFunctionAreaItemVO> _quotationFunctionAreaItemVOs = quotationFunctionAreaVO.getItems();
			
			if(_quotationFunctionAreaItemVOs != null){
				for(QuotationFunctionAreaItemVO quotationFunctionAreaItemVO: _quotationFunctionAreaItemVOs){
					
					if(quotationFunctionAreaItemVO.getCustomFlag() == 0){
						String _uuid = quotationFunctionAreaItemVO.getUuid();
						
						if(_uuid == null || "".equals(_uuid)){
							
							QuotationFunctionAreaItemPO quotationFunctionAreaItemPO = new QuotationFunctionAreaItemPO();
							quotationFunctionAreaItemPO.setUuid(UUIDUtil.getUuid());
							quotationFunctionAreaItemPO.setNum(quotationFunctionAreaItemVO.getNum());
							quotationFunctionAreaItemPO.setQuotationFunctionArea(quotationFunctionAreaPO);
							quotationFunctionAreaItemPO.setQuotationItem(new QuotationItemPO(quotationFunctionAreaItemVO.getItemIdAutoId()));
							
							addQuotationFunctionAreaItems.add(quotationFunctionAreaItemPO);
							addQuotationFunctionAreaItemVOs.add(quotationFunctionAreaItemVO);
						}else{
							if(oldQuotationFunctionAreaItemUuids.contains(_uuid)){
								quotationFunctionAreaItemUuids.add(_uuid);
								quotationFunctionAreaItems.put(_uuid, quotationFunctionAreaItemVO);
							}
						}
					}else if(quotationFunctionAreaItemVO.getCustomFlag() == 1){
						String _itemId = quotationFunctionAreaItemVO.getItemId();
						
						if(_itemId == null || "".equals(_itemId)){
							CustomQuotationItemPO customQuotationItemPO = new CustomQuotationItemPO();
							
							customQuotationItemPO.setItemName(quotationFunctionAreaItemVO.getItemName());
							customQuotationItemPO.setMeasurementUnit(new MeasurementUnitPO(quotationFunctionAreaItemVO.getMeasurementUnitId()));
							customQuotationItemPO.setNum(quotationFunctionAreaItemVO.getNum());
							customQuotationItemPO.setQuotationBigCategory(new QuotationBigCategoryPO(quotationFunctionAreaItemVO.getQuotationBigCategoryId()));
							
							if(QuotationClassificationPO.TYPE_DISPOSABLE_STR.equals(quotationFunctionAreaPO.getFunctionAreaType())){
								customQuotationItemPO.setQuotationClassification(new QuotationClassificationPO(QuotationClassificationPO.TYPE_DISPOSABLE_INT)); // 一次性包死
							}else if(QuotationClassificationPO.TYPE_MANAGEMENT_EXPENSE_STR.equals(quotationFunctionAreaPO.getFunctionAreaType())){
								customQuotationItemPO.setQuotationClassification(new QuotationClassificationPO(QuotationClassificationPO.TYPE_MANAGEMENT_EXPENSE_INT)); // 管理费
							}else if(QuotationClassificationPO.TYPE_INTEGRATED_PROJECT_STR.equals(quotationFunctionAreaPO.getFunctionAreaType())){
								customQuotationItemPO.setQuotationClassification(new QuotationClassificationPO(QuotationClassificationPO.TYPE_INTEGRATED_PROJECT_INT)); // 综合项目
							}else{
								customQuotationItemPO.setQuotationClassification(new QuotationClassificationPO(QuotationClassificationPO.TYPE_OTHER_PART_INT)); // 其他部分
							}
							customQuotationItemPO.setQuotationFunctionArea(quotationFunctionAreaPO);
							customQuotationItemPO.setQuotationItemDes(quotationFunctionAreaItemVO.getQuotationItemDes());
							customQuotationItemPO.setUnitPrice(quotationFunctionAreaItemVO.getUnitPrice());
							customQuotationItemPO.setWorkType(new WorkTypePO(quotationFunctionAreaItemVO.getWorkTypeId()));
							
							addCustomQuotationFunctionAreaItems.add(customQuotationItemPO);
							addCustomQuotationItemVOs.add(quotationFunctionAreaItemVO);
						}else{
							if(oldCustomQuotationFunctionAreaItemIds.contains(_itemId)){
								customQuotationFunctionAreaItemIds.add(_itemId);
								customQuotationFunctionAreaItems.put(_itemId, quotationFunctionAreaItemVO);
							}
						}
					}
				}
			}else{
				quotationFunctionAreaVO.setItems(new ArrayList<QuotationFunctionAreaItemVO>());
			}
		}
		
		updateQuotationFunctionAreaAutoIds.addAll(quotationFunctionAreaAutoIds);
		updateQuotationFunctionAreaItemUuids.addAll(quotationFunctionAreaItemUuids);
		updateCustomerQuotationFunctionAreaItemIds.addAll(customQuotationFunctionAreaItemIds);
		
		removeQuotationFunctionAreaAutoIds.addAll(oldQuotationFunctionAreaAutoIds);
		removeQuotationFunctionAreaItemUuids.addAll(oldQuotationFunctionAreaItemUuids);
		removeCustomerQuotationFunctionAreaItemIds.addAll(oldCustomQuotationFunctionAreaItemIds);
		
		updateQuotationFunctionAreaAutoIds.retainAll(oldQuotationFunctionAreaAutoIds);
		updateQuotationFunctionAreaItemUuids.retainAll(oldQuotationFunctionAreaItemUuids);
		updateCustomerQuotationFunctionAreaItemIds.retainAll(oldCustomQuotationFunctionAreaItemIds);
		
		removeQuotationFunctionAreaAutoIds.removeAll(quotationFunctionAreaAutoIds);
		removeQuotationFunctionAreaItemUuids.removeAll(quotationFunctionAreaItemUuids);
		removeCustomerQuotationFunctionAreaItemIds.removeAll(customQuotationFunctionAreaItemIds);
		
//		System.out.println("--------------------------添加--------------------------");
//		System.out.println(addQuotationFunctionAreas);
//		System.out.println(addQuotationFunctionAreaItems);
//		System.out.println(addCustomQuotationFunctionAreaItems);
//		System.out.println("--------------------------更新--------------------------");
//		System.out.println(updateQuotationFunctionAreaAutoIds);
//		System.out.println(updateQuotationFunctionAreaItemUuids);
//		System.out.println(updateCustomerQuotationFunctionAreaItemIds);
//		System.out.println("--------------------------删除--------------------------");
//		System.out.println(removeQuotationFunctionAreaAutoIds);
//		System.out.println(removeQuotationFunctionAreaItemUuids);
//		System.out.println(removeCustomerQuotationFunctionAreaItemIds);
		
		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
		
		for(QuotationFunctionAreaPO quotationFunctionAreaPO: addQuotationFunctionAreas){ // 添加功能区
			
			quotationFunctionAreaDao.saveOrUpdate(quotationFunctionAreaPO);
			
			QuotationFunctionAreaVO quotationFunctionAreaVO = addQuotationFunctionAreaVOs.get(addQuotationFunctionAreas.indexOf(quotationFunctionAreaPO));
			if(quotationFunctionAreaVO != null){
				quotationFunctionAreaVO.setAutoId(quotationFunctionAreaPO.getAutoId());
			}
		}
		
		for(QuotationFunctionAreaItemPO quotationFunctionAreaItemPO: addQuotationFunctionAreaItems){ // 添加报价项
			if(quotationFunctionAreaItemPO.getQuotationFunctionArea() != null){
				quotationFunctionAreaItemDao.saveOrUpdate(quotationFunctionAreaItemPO);
			}
			
			QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = addQuotationFunctionAreaItemVOs.get(addQuotationFunctionAreaItems.indexOf(quotationFunctionAreaItemPO));
			if(quotationFunctionAreaItemVO != null){
				quotationFunctionAreaItemVO.setUuid(quotationFunctionAreaItemPO.getUuid());
			}
		}
		
		for(CustomQuotationItemPO customQuotationItemPO: addCustomQuotationFunctionAreaItems){ // 添加自定义报价项
			
			int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_CUSTOM_QUOTATION_ITEM_INT, currentDate);
			customQuotationItemPO.setItemId(currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "000000"));
			
			customQuotationItemDao.saveOrUpdate(customQuotationItemPO);
			
			QuotationFunctionAreaItemVO customQuotationItemVO = addCustomQuotationItemVOs.get(addCustomQuotationFunctionAreaItems.indexOf(customQuotationItemPO));
			if(customQuotationItemVO != null){
				customQuotationItemVO.setItemId(customQuotationItemPO.getItemId());
			}
		}
		
		for(String uuid: updateQuotationFunctionAreaItemUuids){ // 更新报价项信息
			
			QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = quotationFunctionAreaItems.get(uuid);
			QuotationFunctionAreaItemPO oldQuotationFunctionAreaItemPO = oldQuotationFunctionAreaItems.get(uuid);
			
			if(oldQuotationFunctionAreaItemPO.getNum() != quotationFunctionAreaItemVO.getNum()){
				oldQuotationFunctionAreaItemPO.setNum(quotationFunctionAreaItemVO.getNum());
				
				quotationFunctionAreaItemDao.update(oldQuotationFunctionAreaItemPO);
			}
		}
		
		for(String itemId: updateCustomerQuotationFunctionAreaItemIds){ // 更新自定义报价项信息
			
			QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = customQuotationFunctionAreaItems.get(itemId);
			CustomQuotationItemPO customQuotationItemPO = oldCustomQuotationFunctionAreaItems.get(itemId);
			
			customQuotationItemPO.setItemName(quotationFunctionAreaItemVO.getItemName());
			customQuotationItemPO.setQuotationBigCategory(new QuotationBigCategoryPO(quotationFunctionAreaItemVO.getQuotationBigCategoryId()));
			customQuotationItemPO.setMeasurementUnit(new MeasurementUnitPO(quotationFunctionAreaItemVO.getMeasurementUnitId()));
			customQuotationItemPO.setNum(quotationFunctionAreaItemVO.getNum());
			customQuotationItemPO.setUnitPrice(quotationFunctionAreaItemVO.getUnitPrice());
			
			customQuotationItemDao.update(customQuotationItemPO);
		}
		
		for(Long autoId: updateQuotationFunctionAreaAutoIds){ // 更新功能区信息
			
			QuotationFunctionAreaVO quotationFunctionAreaVO = quotationFunctionAreas.get(autoId);
			QuotationFunctionAreaPO oldQuotationFunctionAreaPO = oldQuotationFunctionAreas.get(autoId);
			
			oldQuotationFunctionAreaPO.setFunctionAreaName(quotationFunctionAreaVO.getFunctionAreaName());
			oldQuotationFunctionAreaPO.setFunctionAreaOrder(quotationFunctionAreaVO.getFunctionAreaOrder());
			
			quotationFunctionAreaDao.update(oldQuotationFunctionAreaPO);
		}
		
		customQuotationItemDao.deleteCustomQuotationItemByitemIds(removeCustomerQuotationFunctionAreaItemIds);
		quotationFunctionAreaItemDao.deleteQuotationFunctionAreaItemByUuids(removeQuotationFunctionAreaItemUuids);
		quotationFunctionAreaItemDao.deleteQuotationFunctionAreaItemByFunctionAreaIds(removeQuotationFunctionAreaAutoIds);
		quotationFunctionAreaDao.deleteQuotationFunctionAreaByIds(removeQuotationFunctionAreaAutoIds);
		
		return 0;
	}
	
	public int queryQuotationForChange(String orderId){
		
		int res = 1;
		List<String> status = Arrays.asList(new String[]{DecorationOrderPO.STATUS_CONSULT_STR, DecorationOrderPO.STATUS_AMOUNT_STR, DecorationOrderPO.STATUS_QUOTATION_STR, DecorationOrderPO.STATUS_DEPOSIT_STR, DecorationOrderPO.STATUS_RESIGNED_STR});
		List<String> paymentStatus = Arrays.asList(new String[]{DecorationPaymentPO.PAYMENTTYPE_ADVANCE_STR, DecorationPaymentPO.PAYMENTTYPE_DESIGN_STR, DecorationPaymentPO.PAYMENTTYPE_DEPOSIT_STR});
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(orderId);
		
		if(decorationOrderPO != null && status.contains(decorationOrderPO.getStatus())){
			if(DecorationOrderPO.STATUS_SIGNED_STR.equals(decorationOrderPO.getStatus()) || !paymentStatus.contains(decorationOrderPO.getPaymentStatus())){ // 首付款交了或者已签约 就只能微调了
				long adjustmentTime = SystemConfig.getInt("adjustmentDate", 2) * 24 * 60 * 60 * 1000;
				long endTime = (new Date()).getTime() - adjustmentTime;
				
				if(decorationOrderPO.getContractTime() == null || endTime <= decorationOrderPO.getContractTime().getTime()){
					res = 1; // 微调
				}else{
					res = 0; // 不可改
				}
			}else{
				res = 2; // 随便改
			}
		}else{
			res = 0;
		}
		
		return res;
	}
	
	@Transactional(rollbackFor=Exception.class)
	public QuotationDetailVO queryQuotationDetail(QuotationPO quotationPO) throws FLException{
		
		if(quotationPO == null){
			throw new FLException(200003, "报价不存在");
		}
		
		QuotationDetailVO quotationDetailVO = new QuotationDetailVO();
		
		DecorationOrderPO decorationOrderPO = quotationPO.getDecorationOrder();
		UserPO createUser = quotationPO.getCreateUser();
		
		quotationDetailVO.setAutoId(quotationPO.getAutoId());
		quotationDetailVO.setContractTime(decorationOrderPO.getContractTime());
		quotationDetailVO.setCreateTime(quotationPO.getCreateTime());
		quotationDetailVO.setDecorationStyle(quotationPO.getDecorationStyle());
		
		quotationDetailVO.setDesigner(createUser.getCurrentName());
		quotationDetailVO.setDesignerId(createUser.getUserId());
		quotationDetailVO.setDesignerPhone(createUser.getPhone());
		
		CustomerVO customerVO = new CustomerVO();
		BeanUtil.copyProperties(decorationOrderPO.getCustomerPO(), customerVO);
		quotationDetailVO.setCustomer(customerVO);
		quotationDetailVO.setHouseNumber(decorationOrderPO.getHouseNumber());
		
		VillageVO villageVO = villageService.queryVillageById(new VillageVO(decorationOrderPO.getVillagePO().getVillageId()));
		quotationDetailVO.setVillage(villageVO);
		
		quotationDetailVO.setHouseArea(decorationOrderPO.getHouseArea());
		quotationDetailVO.setFreeArea(decorationOrderPO.getFreeArea());
		
		if(decorationOrderPO.getNotSalesmanRate() != null){
			quotationDetailVO.setNotSalesmanRate(decorationOrderPO.getNotSalesmanRate());
		}else{
			quotationDetailVO.setNotSalesmanRate((float) 0);
		}
		
		quotationDetailVO.setDiscount(quotationPO.getDiscount());
		
		quotationDetailVO.setOrderId(decorationOrderPO.getOrderId());
		quotationDetailVO.setOrderStatus(decorationOrderPO.getStatus());
		quotationDetailVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
		quotationDetailVO.setVersionId(decorationOrderPO.getVersionPO().getVersionId());
		quotationDetailVO.setHouseType(decorationOrderPO.getHouseType());
		
		quotationDetailVO.setQuotationContent(quotationPO.getQuotationContent());
		quotationDetailVO.setQuotationName(quotationPO.getQuotationName());
		quotationDetailVO.setSaveStatus(quotationPO.getSaveStatus());
		quotationDetailVO.setStatus(quotationPO.getStatus());
		quotationDetailVO.setTotalPrice(quotationPO.getTotalPrice());
		
		quotationDetailVO.setLimitCarManagePrice(SystemConfig.getFloat("limitCarManagePrice", 300));
		
		quotationDetailVO.setFirstRate(SystemConfig.getFloat("firstRate", 35));
		quotationDetailVO.setFirstSecondRate(SystemConfig.getFloat("firstSecondRate", 30));
		quotationDetailVO.setSecondRate(SystemConfig.getFloat("secondRate", 32));
		quotationDetailVO.setLastRate(SystemConfig.getFloat("lastRate", 2));
		
		List<QuotationFunctionAreaVO> functionAreaVOs = new ArrayList<QuotationFunctionAreaVO>();
		List<QuotationFunctionAreaPO> quotationFunctionAreaPOs = quotationFunctionAreaDao.queryQuotationFunctionAreaByQuotationId(quotationPO.getAutoId());
		
		for(QuotationFunctionAreaPO quotationFunctionAreaPO: quotationFunctionAreaPOs){ // 功能区
			QuotationFunctionAreaVO quotationFunctionAreaVO = new QuotationFunctionAreaVO();
			
			quotationFunctionAreaVO.setAutoId(quotationFunctionAreaPO.getAutoId());
			quotationFunctionAreaVO.setFunctionAreaName(quotationFunctionAreaPO.getFunctionAreaName());
			quotationFunctionAreaVO.setFunctionAreaOrder(quotationFunctionAreaPO.getFunctionAreaOrder());
			quotationFunctionAreaVO.setFunctionAreaType(quotationFunctionAreaPO.getFunctionAreaType());
			
			List<QuotationFunctionAreaItemVO> quotationFunctionAreaItemVOs = new ArrayList<QuotationFunctionAreaItemVO>();
			List<QuotationFunctionAreaItemPO> quotationFunctionAreaItemPOs = quotationFunctionAreaItemDao.queryQuotationFunctionAreaItemByFunctionAreaId(quotationFunctionAreaVO.getAutoId());
			
			for(QuotationFunctionAreaItemPO quotationFunctionAreaItemPO: quotationFunctionAreaItemPOs){ // 报价项
				QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = new QuotationFunctionAreaItemVO();
				
				QuotationItemPO quotationItemPO = quotationFunctionAreaItemPO.getQuotationItem();
				MeasurementUnitPO measurementUnitPO = quotationItemPO.getMeasurementUnit();
				QuotationBigCategoryPO quotationBigCategoryPO = quotationItemPO.getQuotationBigCategory();
				QuotationClassificationPO quotationClassificationPO = quotationItemPO.getQuotationClassification();
				WorkTypePO workTypePO = quotationItemPO.getWorkType();
				
				quotationFunctionAreaItemVO.setQfaiId(quotationFunctionAreaItemPO.getQfaiId());
				
				quotationFunctionAreaItemVO.setUuid(quotationFunctionAreaItemPO.getUuid());
				quotationFunctionAreaItemVO.setItemIdAutoId(quotationItemPO.getAutoId());
				quotationFunctionAreaItemVO.setItemId(quotationItemPO.getItemId());
				quotationFunctionAreaItemVO.setItemName(quotationItemPO.getItemName());
				quotationFunctionAreaItemVO.setQuotationItemDes(quotationItemPO.getQuotationItemDes());
				quotationFunctionAreaItemVO.setUnitPrice(quotationItemPO.getUnitPrice());
				
				quotationFunctionAreaItemVO.setNum(quotationFunctionAreaItemPO.getNum());
				
				quotationFunctionAreaItemVO.setMeasurementUnit(measurementUnitPO.getName());
				quotationFunctionAreaItemVO.setMeasurementUnitId(measurementUnitPO.getId());
				
				quotationFunctionAreaItemVO.setQuotationBigCategory(quotationBigCategoryPO.getName());
				quotationFunctionAreaItemVO.setQuotationBigCategoryId(quotationBigCategoryPO.getId());
				
				quotationFunctionAreaItemVO.setQuotationClassification(quotationClassificationPO.getName());
				quotationFunctionAreaItemVO.setQuotationClassificationId(quotationClassificationPO.getId());
				
				quotationFunctionAreaItemVO.setWorkType(workTypePO.getName());
				quotationFunctionAreaItemVO.setWorkTypeId(workTypePO.getId());
				
				quotationFunctionAreaItemVO.setItemType(QuotationFunctionAreaItemPO.TYPE_ORIGINAL_STR);
				quotationFunctionAreaItemVO.setCustomFlag(0);
				
				quotationFunctionAreaItemVO.setFunctionAreaId(quotationFunctionAreaVO.getAutoId());
				quotationFunctionAreaItemVO.setFunctionAreaName(quotationFunctionAreaVO.getFunctionAreaName());
				
				quotationFunctionAreaItemVOs.add(quotationFunctionAreaItemVO);
			}
			
			List<CustomQuotationItemPO> customQuotationItemPOs = customQuotationItemDao.getAllCustomQuotationItemsByFunctionAreaId(quotationFunctionAreaVO.getAutoId());
			for(CustomQuotationItemPO customQuotationItemPO: customQuotationItemPOs){ // 自定义报价项
				QuotationFunctionAreaItemVO quotationFunctionAreaItemVO = new QuotationFunctionAreaItemVO();
				
				MeasurementUnitPO measurementUnitPO = customQuotationItemPO.getMeasurementUnit();
				QuotationBigCategoryPO quotationBigCategoryPO = customQuotationItemPO.getQuotationBigCategory();
				QuotationClassificationPO quotationClassificationPO = customQuotationItemPO.getQuotationClassification();
				WorkTypePO workTypePO = customQuotationItemPO.getWorkType();
				
				quotationFunctionAreaItemVO.setQfaiId(customQuotationItemPO.getAutoId());
				
				quotationFunctionAreaItemVO.setItemIdAutoId(customQuotationItemPO.getAutoId());
				quotationFunctionAreaItemVO.setItemId(customQuotationItemPO.getItemId());
				quotationFunctionAreaItemVO.setItemName(customQuotationItemPO.getItemName());
				quotationFunctionAreaItemVO.setUnitPrice(customQuotationItemPO.getUnitPrice());
				quotationFunctionAreaItemVO.setNum(customQuotationItemPO.getNum());
				quotationFunctionAreaItemVO.setQuotationItemDes(customQuotationItemPO.getQuotationItemDes());
				
				quotationFunctionAreaItemVO.setMeasurementUnit(measurementUnitPO.getName());
				quotationFunctionAreaItemVO.setMeasurementUnitId(measurementUnitPO.getId());
				
				quotationFunctionAreaItemVO.setQuotationBigCategory(quotationBigCategoryPO.getName());
				quotationFunctionAreaItemVO.setQuotationBigCategoryId(quotationBigCategoryPO.getId());
				
				quotationFunctionAreaItemVO.setQuotationClassification(quotationClassificationPO.getName());
				quotationFunctionAreaItemVO.setQuotationClassificationId(quotationClassificationPO.getId());
				
				quotationFunctionAreaItemVO.setWorkType(workTypePO.getName());
				quotationFunctionAreaItemVO.setWorkTypeId(workTypePO.getId());
				
				quotationFunctionAreaItemVO.setItemType(QuotationFunctionAreaItemPO.TYPE_ORIGINAL_STR);
				quotationFunctionAreaItemVO.setCustomFlag(1);
				quotationFunctionAreaItemVOs.add(quotationFunctionAreaItemVO);
			}
			
			quotationFunctionAreaVO.setItems(quotationFunctionAreaItemVOs);
			
			functionAreaVOs.add(quotationFunctionAreaVO);
		} // 功能区
		
		quotationDetailVO.setFunctionAreas(functionAreaVOs);
		
		Map<String, Integer> latexCutScale = new HashMap<String, Integer>();
		String[] latexCutScales = SystemConfig.getString("latexCutScale", "").split(",");
		
		for(String lcs: latexCutScales){
			String key = lcs.split(":")[0];
			Integer value = Integer.valueOf(lcs.split(":")[1]);
			latexCutScale.put(key, value);
		}
		quotationDetailVO.setLatexCutScale(latexCutScale);
		
		List<Integer> trafficPriceScale = new ArrayList<Integer>();
		String[] trafficPriceScales = SystemConfig.getString("trafficPriceScale", "").split(",");
		
		for(String tps: trafficPriceScales){
			trafficPriceScale.add(Integer.valueOf(tps));
		}
		quotationDetailVO.setTrafficPriceScale(trafficPriceScale);
		
		return quotationDetailVO;
	}
	
	private void quotationDetailVOToQuotationPO(QuotationDetailVO quotationDetailVO, QuotationPO quotationPO) throws FLException{
		
//		if(quotationDetailVO.getDiscount() < SystemConfig.getFloat("defaultApprovalDiscount")){
//			throw new FLException(200006, "报价折扣低于最低折扣");
//		}
		
		if(quotationDetailVO.getDiscount() != null){
			quotationPO.setDiscount(quotationDetailVO.getDiscount());
		}else{
			quotationPO.setDiscount(10);
		}
		
		if(quotationDetailVO.getTotalPrice() != null){
			quotationPO.setTotalPrice(quotationDetailVO.getTotalPrice());
		}else{
			quotationPO.setTotalPrice(0);
		}
		
		if(quotationDetailVO.getLatexCut() != null){
			quotationPO.setLatexCut(quotationDetailVO.getLatexCut());
		}else{
			quotationPO.setLatexCut(0);
		}
		
		if(quotationDetailVO.getManageRate() != null){
			quotationPO.setManageRate(quotationDetailVO.getManageRate());
		}else{
			quotationPO.setManageRate(0);
		}
		
		if(quotationDetailVO.getManagePrice() != null){
			quotationPO.setManagePrice(quotationDetailVO.getManagePrice());
		}else{
			quotationPO.setManagePrice(0);
		}
		
		if(quotationDetailVO.getTrafficPrice() != null){
			quotationPO.setTrafficPrice(quotationDetailVO.getTrafficPrice());
		}else{
			quotationPO.setTrafficPrice(0);
		}
	}
	
}
