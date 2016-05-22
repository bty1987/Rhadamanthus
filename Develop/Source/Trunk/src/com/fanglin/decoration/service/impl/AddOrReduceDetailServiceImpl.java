package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.po.MeasurementUnitPO;
import com.fanglin.common.po.WorkTypePO;
import com.fanglin.common.service.CountingService;
import com.fanglin.construction.dao.AddReduceDao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.dao.AddOrReduceDetailDao;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.AddOrReduceDetailPO;
import com.fanglin.decoration.po.AddReducePO;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.service.AddOrReduceDetailService;
import com.fanglin.decoration.vo.AddOrReduceDetailVO;
import com.fanglin.decoration.vo.AddOrReduceItemVO;
import com.fanglin.decoration.vo.AddReduceVO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationBigCategoryPO;
import com.fanglin.quotation.po.QuotationClassificationPO;
import com.fanglin.quotation.po.QuotationFunctionAreaItemPO;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.quotation.po.SystemDefineItemPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;


@Service("addOrReduceDetailService")
@Transactional(readOnly = true)
public class AddOrReduceDetailServiceImpl implements AddOrReduceDetailService {
	
	@Autowired
	private CountingService countingService;

	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private DecorationPaymentDao decorationPaymentDao;
	
	@Autowired
	private AddOrReduceDetailDao addOrReduceDetailDao;
	
	@Autowired
	private AddReduceDao addReduceDao;
	
	@Autowired
	private QuotationDao quotationDao;
	
	@Override
	public void pageAddOrReduceDetailByArId(Paging paging, List<FilterVO> filters, AddReduceVO addReduceVO){
		
		List<AddOrReduceDetailPO> addOrReduceDetailPOs = addOrReduceDetailDao.pageAddOrReduceDetailById(paging, filters, addReduceVO.getArId());
		List<AddOrReduceItemVO> addOrReduceItemVOs = new ArrayList<AddOrReduceItemVO>(); 
		
		for(AddOrReduceDetailPO addOrReduceDetailPO: addOrReduceDetailPOs){
			AddOrReduceItemVO addOrReduceItemVO = new AddOrReduceItemVO();
			BeanUtil.copyProperties(addOrReduceDetailPO, addOrReduceItemVO);
			
			addOrReduceItemVO.setMeasurementUnit(addOrReduceDetailPO.getMeasurementUnitPO().getName());
			addOrReduceItemVO.setMeasurementUnitId(addOrReduceDetailPO.getMeasurementUnitPO().getId());
			
			addOrReduceItemVO.setQuotationBigCategory(addOrReduceDetailPO.getQuotationBigCategoryPO().getName());
			addOrReduceItemVO.setQuotationBigCategoryId(addOrReduceDetailPO.getQuotationBigCategoryPO().getId());
			
			addOrReduceItemVO.setWorkType(addOrReduceDetailPO.getWorkTypePO().getName());
			addOrReduceItemVO.setWorkTypeId(addOrReduceDetailPO.getWorkTypePO().getId());
			addOrReduceItemVO.setQuotationFunctionAreaId(addOrReduceDetailPO.getQuotationFunctionAreaPO().getAutoId());
			addOrReduceItemVO.setQuotationFunctionAreaName(addOrReduceDetailPO.getQuotationFunctionAreaPO().getFunctionAreaName());
			addOrReduceItemVO.setQuotationClassification(addOrReduceDetailPO.getQuotationClassificationPO().getName());
			addOrReduceItemVO.setQuotationClassificationId(addOrReduceDetailPO.getQuotationClassificationPO().getId());
			
			addOrReduceItemVOs.add(addOrReduceItemVO);
		}
		
		paging.setData(addOrReduceItemVOs);
	}
	
	@Override
	public AddOrReduceDetailVO queryAddOrReduceDetailById(AddOrReduceDetailVO addOrReduceDetailVO) throws FLException{
		
		int arId = addOrReduceDetailVO.getArId();
		
		AddReducePO addReducePO = addReduceDao.get(arId);
		
		if(addReducePO == null){
			throw new FLException(140018, "增减项不存在");
		}
		
		String orderId = addReducePO.getOrderId();
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(orderId);
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(addReducePO.getOrderId());
		
		if(quotationPO == null){
			throw new FLException(200017, "默认报价不存在");
		}
		
		addOrReduceDetailVO.setAddReduceDes(addReducePO.getAddReduceDes());
		addOrReduceDetailVO.setAddReduceStatus(addReducePO.getAddReduceStatus());
		addOrReduceDetailVO.setAddReduceTotal(addReducePO.getAddReduceTotal());
		addOrReduceDetailVO.setAddReduceType(addReducePO.getAddReduceType());
		addOrReduceDetailVO.setArId(addReducePO.getArId());
		addOrReduceDetailVO.setCreateTime(addReducePO.getCreateTime());
		addOrReduceDetailVO.setOrderId(addReducePO.getOrderId());
		
		addOrReduceDetailVO.setOrderPaymentId(addReducePO.getOrderPaymentId());
		addOrReduceDetailVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
		addOrReduceDetailVO.setQuotationDiscount(quotationPO.getDiscount());
		addOrReduceDetailVO.setQuotationId(quotationPO.getAutoId());
		
		addOrReduceDetailVO.setVersionId(decorationOrderPO.getVersionPO().getVersionId());
		addOrReduceDetailVO.setVersionName(decorationOrderPO.getVersionPO().getVersionName());
		
		List<AddOrReduceDetailPO> addOrReduceDetailPOs = addOrReduceDetailDao.queryAddOrReduceDetailById(arId);
		List<AddOrReduceItemVO> addOrReduceItemVOs = new ArrayList<AddOrReduceItemVO>(); 
		
		for(AddOrReduceDetailPO addOrReduceDetailPO : addOrReduceDetailPOs){
			AddOrReduceItemVO addOrReduceItemVO = new AddOrReduceItemVO();
			BeanUtil.copyProperties(addOrReduceDetailPO, addOrReduceItemVO);
			
			addOrReduceItemVO.setMeasurementUnit(addOrReduceDetailPO.getMeasurementUnitPO().getName());
			addOrReduceItemVO.setMeasurementUnitId(addOrReduceDetailPO.getMeasurementUnitPO().getId());
			
			addOrReduceItemVO.setQuotationBigCategory(addOrReduceDetailPO.getQuotationBigCategoryPO().getName());
			addOrReduceItemVO.setQuotationBigCategoryId(addOrReduceDetailPO.getQuotationBigCategoryPO().getId());
			
			addOrReduceItemVO.setWorkType(addOrReduceDetailPO.getWorkTypePO().getName());
			addOrReduceItemVO.setWorkTypeId(addOrReduceDetailPO.getWorkTypePO().getId());
			addOrReduceItemVO.setQuotationFunctionAreaId(addOrReduceDetailPO.getQuotationFunctionAreaPO().getAutoId());
			addOrReduceItemVO.setQuotationFunctionAreaName(addOrReduceDetailPO.getQuotationFunctionAreaPO().getFunctionAreaName());
			addOrReduceItemVO.setQuotationClassification(addOrReduceDetailPO.getQuotationClassificationPO().getName());
			addOrReduceItemVO.setQuotationClassificationId(addOrReduceDetailPO.getQuotationClassificationPO().getId());
			
			addOrReduceItemVOs.add(addOrReduceItemVO);
		}
		
		addOrReduceDetailVO.setAddOrReduceItems(addOrReduceItemVOs);
		
		return addOrReduceDetailVO;
	}
	
	@Override
	public AddOrReduceDetailVO queryAddOrReduceDetailForNoItemById(int addOrReduceId){
		AddOrReduceDetailVO addOrReduceDetailVO = new AddOrReduceDetailVO();
		
		AddReducePO addReducePO = addReduceDao.get(addOrReduceId);
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(addReducePO.getOrderId());
		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(addReducePO.getOrderId());
		
		addOrReduceDetailVO.setAddReduceDes(addReducePO.getAddReduceDes());
		addOrReduceDetailVO.setAddReduceStatus(addReducePO.getAddReduceStatus());
		addOrReduceDetailVO.setAddReduceTotal(addReducePO.getAddReduceTotal());
		addOrReduceDetailVO.setAddReduceType(addReducePO.getAddReduceType());
		addOrReduceDetailVO.setArId(addReducePO.getArId());
		addOrReduceDetailVO.setCreateTime(addReducePO.getCreateTime());
		addOrReduceDetailVO.setOrderId(addReducePO.getOrderId());
		addOrReduceDetailVO.setOrderPaymentId(addReducePO.getOrderPaymentId());
		addOrReduceDetailVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
		addOrReduceDetailVO.setQuotationDiscount(quotationPO.getDiscount());
		addOrReduceDetailVO.setVersionId(decorationOrderPO.getVersionPO().getVersionId());
		addOrReduceDetailVO.setVersionName(decorationOrderPO.getVersionPO().getVersionName());		
		
		return addOrReduceDetailVO;
	}
	
	@Override
	public int queryAddOrReduceDetailByIds(List<Integer> addOrReduceIds, List<AddOrReduceDetailVO> addOrReduceDetailVOs) throws FLException{
		
		String orderId = "";
		
		if(addOrReduceDetailVOs != null && addOrReduceIds != null){
			for(Integer addOrReduceId: addOrReduceIds){
				
				AddOrReduceDetailVO addOrReduceDetailVO = queryAddOrReduceDetailById(new AddOrReduceDetailVO(addOrReduceId));
				if("".equals(orderId)){
					orderId = addOrReduceDetailVO.getOrderId();
					
					addOrReduceDetailVOs.add(addOrReduceDetailVO);
				}else if(orderId.equals(addOrReduceDetailVO.getOrderId())){
					addOrReduceDetailVOs.add(addOrReduceDetailVO);
				}else{
					throw new FLException(140001, "存在不同的订单编号");
				}
			}
		}
		
		return 0;
	}
	
	@Override
	public int calAddOrReduceForSumPrice(AddOrReduceDetailVO addOrReduceDetail){
		
		List<Integer> quotationClassificationIds = Arrays.asList(new Integer[]{QuotationClassificationPO.TYPE_DISPOSABLE_INT, QuotationClassificationPO.TYPE_INTEGRATED_PROJECT_INT, QuotationClassificationPO.TYPE_MANAGEMENT_EXPENSE_INT});
		
		AddOrReduceDetailVO addOrReduceDetailVO  = queryAddOrReduceDetailForNoItemById(addOrReduceDetail.getArId());
		List<AddOrReduceItemVO> addOrReduceItemVOs = addOrReduceDetail.getAddOrReduceItems();
		
		float totalPrice = (float) 0;
		
		if(addOrReduceDetailVO.getAddReduceType() == AddReducePO.ADDREDUCETYPE_REDUCE_INT){ // 减项
			if(addOrReduceItemVOs != null && addOrReduceItemVOs.size() != 0){
				for(AddOrReduceItemVO addOrReduceItemVO: addOrReduceItemVOs){ // 0 报价项 1、自定义报价项目 2、新增自定义报价项目 3、系统定义报价项目

					if(addOrReduceItemVO.getItemType() == SystemDefineItemPO.TYPE_SYSTEMDEFINEITEM_INT){//系统定义报价项目不打折
						totalPrice = Arith.add(totalPrice, Arith.round((addOrReduceItemVO.getUnitPrice()), 2));
					}else if(addOrReduceItemVO.getItemType() == QuotationFunctionAreaItemPO.TYPE_QUOTATIONITEM_INT && (quotationClassificationIds.contains(addOrReduceItemVO.getQuotationClassificationId()))){ // 一次性包死 综合项目 管理费 不打折
						totalPrice = Arith.add(totalPrice, Arith.round((addOrReduceItemVO.getUnitPrice()*addOrReduceItemVO.getNum()), 2));
					}else{
						totalPrice = (float) Arith.add(totalPrice, Arith.round((Arith.div(Arith.mul(Arith.mul(addOrReduceItemVO.getUnitPrice(), addOrReduceItemVO.getNum()), addOrReduceDetailVO.getQuotationDiscount()), 10f)), 2));
					}
				}
			}
		}else{
			if(addOrReduceItemVOs != null && addOrReduceItemVOs.size() != 0){
				for(AddOrReduceItemVO addOrReduceItemVO: addOrReduceItemVOs){
					totalPrice = Arith.add(totalPrice, Arith.round(Arith.mul(addOrReduceItemVO.getUnitPrice(), addOrReduceItemVO.getNum()), 2));
				}
			}
		}
		
		totalPrice = Math.round(totalPrice);
		
		addOrReduceDetail.setAddReduceTotal((float)((totalPrice)));
		
		return 0;
	}

	@Override
	public int checkAddOrReduceForPenalty(AddOrReduceDetailVO addOrReduceDetail) throws FLException{
		
		AddReducePO addReducePO = addReduceDao.get(addOrReduceDetail.getArId());
		
		if(addReducePO == null){
			throw new FLException(140018, "增减项不存在");
		}
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(addReducePO.getOrderId());
		
		float contractTotalMoney = decorationOrderPO.getOrderTotalPrice();
		float limitMoney = (float) (Arith.mul(contractTotalMoney, SystemConfig.getFloat("breachContractRate", (float) 0.05)));
		float sum = 0;
		
		List<AddReducePO> addReducePOs = addReduceDao.queryAddReduceForNLeakageByOrderId(addReducePO.getOrderId());
		
		for(AddReducePO _addReducePO: addReducePOs){
			if(_addReducePO.getArId() == addReducePO.getArId()){
				continue;
			}
			
			if(_addReducePO.getAddReduceType() == AddReducePO.ADDREDUCETYPE_ADD_INT){
				sum = Arith.sub(sum, _addReducePO.getAddReduceTotal());
			}else if(_addReducePO.getAddReduceType() == AddReducePO.ADDREDUCETYPE_REDUCE_INT){
				sum = Arith.add(sum, _addReducePO.getAddReduceTotal());
			}
		}
		
		calAddOrReduceForSumPrice(addOrReduceDetail);
		
		if(addReducePO.getAddReduceType() == AddReducePO.ADDREDUCETYPE_ADD_INT){
			sum = Arith.sub(sum, addOrReduceDetail.getAddReduceTotal());
		}else if(addReducePO.getAddReduceType() == AddReducePO.ADDREDUCETYPE_REDUCE_INT){
			sum = Arith.add(sum, addOrReduceDetail.getAddReduceTotal());
		}
		
		if(sum >= limitMoney){
			return 1;
		}else{
			return 0;
		}
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int saveAddOrReduceDetail(AddOrReduceDetailVO addOrReduceDetail) throws FLException{
		AddReducePO addReducePO = addReduceDao.get(addOrReduceDetail.getArId());
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(addReducePO.getOrderId());
		
		if(addReducePO.getAddReduceStatus() == AddReducePO.ADDREDUCESTATUS_PAYED_INT || addReducePO.getAddReduceStatus() == AddReducePO.ADDREDUCESTATUS_CONFIRMED_INT){ // 已付款和已确认
			throw new FLException(140002, "已付款或已确认,不可修改");
		}
		
		if(addReducePO.getAddReduceType() == AddReducePO.ADDREDUCETYPE_LEAKAGE_INT){ // 漏项
			throw new FLException(140003, "漏项,不可修改");
		}
		
		calAddOrReduceForSumPrice(addOrReduceDetail);
		
		DecorationPaymentPO decorationPaymentPO = null;
		
		if(addReducePO.getOrderPaymentId() != null){
			decorationPaymentPO = decorationPaymentDao.get(addReducePO.getOrderPaymentId());
			if(!decorationPaymentPO.getPaymentStatus().equals("未付款") && !decorationPaymentPO.getPaymentStatus().equals("未提交")){
				throw new FLException(140004, "已付款或已确认,不可修改");
			}
		}else{
			decorationPaymentPO = new DecorationPaymentPO();
		}
		
		decorationPaymentPO.setPaymentStatus("未提交");
		decorationPaymentPO.setReferMoney(addOrReduceDetail.getAddReduceTotal());
		decorationPaymentPO.setDecorationOrderPO(decorationOrderPO);
		decorationPaymentPO.setCreateUserPO(new UserPO(addOrReduceDetail.getDesignerId()));
		decorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		if(addReducePO.getAddReduceType() == AddReducePO.ADDREDUCETYPE_ADD_INT){
			decorationPaymentPO.setPaymentType("增项款");
		}else if(addReducePO.getAddReduceType() == AddReducePO.ADDREDUCETYPE_REDUCE_INT){
			decorationPaymentPO.setPaymentType("减项款");
		}
		
		decorationPaymentDao.saveOrUpdate(decorationPaymentPO);

		addReducePO.setAddReduceStatus(0);
		addReducePO.setOrderPaymentId(decorationPaymentPO.getAutoId());
		addReducePO.setAddReduceTotal(addOrReduceDetail.getAddReduceTotal());
		addReduceDao.saveOrUpdate(addReducePO);
		
		addOrReduceDetailDao.deleteAddOrReduceDetailById(addOrReduceDetail.getArId());
		
		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
		
		if(addOrReduceDetail.getAddOrReduceItems()!=null){
			for(AddOrReduceItemVO addOrReduceItemVO: addOrReduceDetail.getAddOrReduceItems()){
				AddOrReduceDetailPO addOrReduceDetailPO = new AddOrReduceDetailPO();
				
				int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_ADDORREDUCE_INT, currentDate);
				String customerItemId = currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "000000");
				
				addOrReduceDetailPO.setArId(addReducePO.getArId());
				addOrReduceDetailPO.setItemId(addOrReduceItemVO.getItemId());
				addOrReduceDetailPO.setCustomerItemId(customerItemId);
				addOrReduceDetailPO.setItemName(addOrReduceItemVO.getItemName());
				addOrReduceDetailPO.setItemType(addOrReduceItemVO.getItemType());
				addOrReduceDetailPO.setMeasurementUnitPO(new MeasurementUnitPO(addOrReduceItemVO.getMeasurementUnitId()));
				addOrReduceDetailPO.setNum(addOrReduceItemVO.getNum());
				addOrReduceDetailPO.setQuotationBigCategoryPO(new QuotationBigCategoryPO(addOrReduceItemVO.getQuotationBigCategoryId()));
				addOrReduceDetailPO.setWorkTypePO(new WorkTypePO(addOrReduceItemVO.getWorkTypeId()));
				addOrReduceDetailPO.setUnitPrice(addOrReduceItemVO.getUnitPrice());
				addOrReduceDetailPO.setQuotationItemDes(addOrReduceItemVO.getQuotationItemDes());
				addOrReduceDetailPO.setQuotationFunctionAreaPO(new QuotationFunctionAreaPO(addOrReduceItemVO.getQuotationFunctionAreaId()));
				addOrReduceDetailPO.setQuotationClassificationPO(new QuotationClassificationPO(addOrReduceItemVO.getQuotationClassificationId()));
				
				addOrReduceDetailDao.save(addOrReduceDetailPO);
			}
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitAddOrReduceDetail(AddOrReduceDetailVO addOrReduceDetail) throws FLException{
		AddReducePO addReducePO = addReduceDao.get(addOrReduceDetail.getArId());
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(addReducePO.getOrderId());
		
		if(addReducePO.getAddReduceStatus() == AddReducePO.ADDREDUCESTATUS_PAYED_INT || addReducePO.getAddReduceStatus() == AddReducePO.ADDREDUCESTATUS_CONFIRMED_INT){//已付款和已确认
			throw new FLException(140002, "已付款或已确认,不可修改");
		}
		if(addReducePO.getAddReduceType() == AddReducePO.ADDREDUCETYPE_LEAKAGE_INT){
			throw new FLException(140003, "漏项,不可修改");
		}
		
		calAddOrReduceForSumPrice(addOrReduceDetail);
		
		DecorationPaymentPO decorationPaymentPO = null;
		
		if(addReducePO.getOrderPaymentId() != null){
			decorationPaymentPO = decorationPaymentDao.get(addReducePO.getOrderPaymentId());
			if(!decorationPaymentPO.getPaymentStatus().equals("未付款") && !decorationPaymentPO.getPaymentStatus().equals("未提交")){
				throw new FLException(140002, "已付款或已确认,不可修改");
			}
			
		}else{
			decorationPaymentPO = new DecorationPaymentPO();
		}
		
		decorationPaymentPO.setPaymentStatus("未付款");
		decorationPaymentPO.setReferMoney(addOrReduceDetail.getAddReduceTotal());
		
		decorationPaymentPO.setDecorationOrderPO(decorationOrderPO);
		decorationPaymentPO.setCreateUserPO(new UserPO(addOrReduceDetail.getDesignerId()));
		decorationPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		if(addReducePO.getAddReduceType() == 0){
			decorationPaymentPO.setPaymentType("增项款");
		}else if(addReducePO.getAddReduceType() == 1){
			decorationPaymentPO.setPaymentType("减项款");
		}
		
		decorationPaymentDao.saveOrUpdate(decorationPaymentPO);
		
		addReducePO.setAddReduceStatus(1);
		addReducePO.setAddReduceTotal(addOrReduceDetail.getAddReduceTotal());
		addReducePO.setOrderPaymentId(decorationPaymentPO.getAutoId());
		addReduceDao.saveOrUpdate(addReducePO);
		
		addOrReduceDetailDao.deleteAddOrReduceDetailById(addOrReduceDetail.getArId());
		
		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
		
		if(addOrReduceDetail.getAddOrReduceItems()!=null){
			for(AddOrReduceItemVO addOrReduceItemVO: addOrReduceDetail.getAddOrReduceItems()){
				AddOrReduceDetailPO addOrReduceDetailPO = new AddOrReduceDetailPO();
				
				int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_ADDORREDUCE_INT, currentDate);
				String customerItemId = currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "000000");
				
				addOrReduceDetailPO.setArId(addReducePO.getArId());
				addOrReduceDetailPO.setItemId(addOrReduceItemVO.getItemId());
				addOrReduceDetailPO.setCustomerItemId(customerItemId);
				addOrReduceDetailPO.setItemName(addOrReduceItemVO.getItemName());
				addOrReduceDetailPO.setItemType(addOrReduceItemVO.getItemType());
				addOrReduceDetailPO.setMeasurementUnitPO(new MeasurementUnitPO(addOrReduceItemVO.getMeasurementUnitId()));
				addOrReduceDetailPO.setNum(addOrReduceItemVO.getNum());
				addOrReduceDetailPO.setQuotationBigCategoryPO(new QuotationBigCategoryPO(addOrReduceItemVO.getQuotationBigCategoryId()));
				addOrReduceDetailPO.setWorkTypePO(new WorkTypePO(addOrReduceItemVO.getWorkTypeId()));
				addOrReduceDetailPO.setQuotationItemDes(addOrReduceItemVO.getQuotationItemDes());
				addOrReduceDetailPO.setUnitPrice(addOrReduceItemVO.getUnitPrice());
				addOrReduceDetailPO.setQuotationFunctionAreaPO(new QuotationFunctionAreaPO(addOrReduceItemVO.getQuotationFunctionAreaId()));
				addOrReduceDetailPO.setQuotationClassificationPO(new QuotationClassificationPO(addOrReduceItemVO.getQuotationClassificationId()));
				
				addOrReduceDetailDao.save(addOrReduceDetailPO);
			}
		}
		
		return 0;
	}
}
