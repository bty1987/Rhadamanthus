/**
 * Title: BudgetAuditItemServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author bty1987
 *
 */

package com.fanglin.audit.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.audit.dao.BudgetAuditItemDao;
import com.fanglin.audit.po.BudgetAuditItemPO;
import com.fanglin.audit.service.BudgetAuditItemService;
import com.fanglin.audit.vo.BudgetAuditItemVO;
import com.fanglin.audit.vo.BudgetAuditVO;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.po.MeasurementUnitPO;
import com.fanglin.common.po.WorkTypePO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.po.QuotationBigCategoryPO;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationFunctionAreaPO;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.salary.po.UserSalaryPO;
import com.fanglin.salary.service.UserSalaryService;
import com.fanglin.salary.vo.UserSalaryVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("budgetAuditItemService")
@Transactional(readOnly = true)
public class BudgetAuditItemServiceImpl implements BudgetAuditItemService {
	
	@Autowired
	private CountingService countingService;

	@Autowired
	private BudgetAuditItemDao budgetAuditItemDao;

	@Autowired
	private DecorationOrderDao decorationOrderDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private UserSalaryService userSalaryService;

	@Autowired
	private MessageService messageService;
	
	@Override
	public void pageBudgetAuditItemByOrderId(Paging paging, List<FilterVO> filters, BudgetAuditVO budgetAuditVO){
		
		List<BudgetAuditItemPO> budgetAuditItemPOs = budgetAuditItemDao.pageBudgetAuditByOrderId(paging, filters, budgetAuditVO.getOrderId());
		List<BudgetAuditItemVO> budgetAuditItemVOs = new ArrayList<BudgetAuditItemVO>();

		for(BudgetAuditItemPO budgetAuditItemPO: budgetAuditItemPOs){
			BudgetAuditItemVO budgetAuditItemVO = new BudgetAuditItemVO();
			BeanUtil.copyProperties(budgetAuditItemPO, budgetAuditItemVO);
			
			QuotationFunctionAreaPO quotationFunctionAreaPO = budgetAuditItemPO.getQuotationFunctionArea();
			QuotationBigCategoryPO quotationBigCategoryPO = budgetAuditItemPO.getQuotationBigCategory();

			budgetAuditItemVO.setFunctionAreaId(quotationFunctionAreaPO.getQfaId());
			budgetAuditItemVO.setFunctionAreaName(quotationFunctionAreaPO.getFunctionAreaName());

			budgetAuditItemVO.setCategoryId(quotationBigCategoryPO.getId());
			budgetAuditItemVO.setCategoryName(quotationBigCategoryPO.getName());

			budgetAuditItemVO.setMeasurementUnitId(budgetAuditItemPO.getMeasurementUnit().getId());
			budgetAuditItemVO.setMeasurementUnitName(budgetAuditItemPO.getMeasurementUnit().getName());

			budgetAuditItemVO.setWorkTypeId(budgetAuditItemPO.getWorkType().getId());
			budgetAuditItemVO.setWorkTypeName(budgetAuditItemPO.getWorkType().getName());

			budgetAuditItemVOs.add(budgetAuditItemVO);
		}
		
		paging.setData(budgetAuditItemVOs);
	}

	@Override
	public BudgetAuditVO queryBudgetAuditItemByOrderId(BudgetAuditVO budgetAuditVO){
		
		String orderId = budgetAuditVO.getOrderId();

		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(orderId);
		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(orderId);
		

		budgetAuditVO.setOrderTotalPrice(decorationOrderPO.getOrderTotalPrice());
		budgetAuditVO.setQuotationDiscount(quotationPO.getDiscount());
		budgetAuditVO.setQuotationId(quotationPO.getQid());

		budgetAuditVO.setVersionId(decorationOrderPO.getVersionPO().getVersionId());
		budgetAuditVO.setVersionName(decorationOrderPO.getVersionPO().getVersionName());
		budgetAuditVO.setOrderId(orderId);
		
		List<BudgetAuditItemPO> budgetAuditItemPOs = budgetAuditItemDao.queryBudgetAuditByOrderId(orderId);
		List<BudgetAuditItemVO> budgetAuditItemVOs = new ArrayList<BudgetAuditItemVO>();

		for(BudgetAuditItemPO budgetAuditItemPO: budgetAuditItemPOs){
			BudgetAuditItemVO budgetAuditItemVO = new BudgetAuditItemVO();
			BeanUtil.copyProperties(budgetAuditItemPO, budgetAuditItemVO);
			
			QuotationFunctionAreaPO quotationFunctionAreaPO = budgetAuditItemPO.getQuotationFunctionArea();
			QuotationBigCategoryPO quotationBigCategoryPO = budgetAuditItemPO.getQuotationBigCategory();

			budgetAuditItemVO.setFunctionAreaId(quotationFunctionAreaPO.getQfaId());
			budgetAuditItemVO.setFunctionAreaName(quotationFunctionAreaPO.getFunctionAreaName());

			budgetAuditItemVO.setCategoryId(quotationBigCategoryPO.getId());
			budgetAuditItemVO.setCategoryName(quotationBigCategoryPO.getName());

			budgetAuditItemVO.setMeasurementUnitId(budgetAuditItemPO.getMeasurementUnit().getId());
			budgetAuditItemVO.setMeasurementUnitName(budgetAuditItemPO.getMeasurementUnit().getName());

			budgetAuditItemVO.setWorkTypeId(budgetAuditItemPO.getWorkType().getId());
			budgetAuditItemVO.setWorkTypeName(budgetAuditItemPO.getWorkType().getName());

			budgetAuditItemVOs.add(budgetAuditItemVO);
		}

		budgetAuditVO.setBudgetAuditItems(budgetAuditItemVOs);

		return budgetAuditVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addBudgetAuditItem(BudgetAuditVO budgetAuditVO){
		budgetAuditItemDao.deleteBudgetAuditByOrderId(budgetAuditVO.getOrderId());
		
		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
		
		
		if(budgetAuditVO.getBudgetAuditItems() != null){
			for(BudgetAuditItemVO budgetAuditItemVO: budgetAuditVO.getBudgetAuditItems()){
				
				BudgetAuditItemPO budgetAuditItemPO = new BudgetAuditItemPO();
				
				int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_BUDGET_AUDIT_ITEM_INT, currentDate);
				String customerItemId = currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "000000");
				
				budgetAuditItemPO.setOrderId(budgetAuditItemVO.getOrderId());
				budgetAuditItemPO.setItemId(budgetAuditItemVO.getItemId());
				budgetAuditItemPO.setCustomerItemId(customerItemId);
				budgetAuditItemPO.setItemName(budgetAuditItemVO.getItemName());
				budgetAuditItemPO.setItemType(budgetAuditItemVO.getItemType());
				budgetAuditItemPO.setUnitPrice(budgetAuditItemVO.getUnitPrice());
				budgetAuditItemPO.setNum(budgetAuditItemVO.getNum());
				budgetAuditItemPO.setStatus(budgetAuditItemVO.getStatus());
				budgetAuditItemPO.setDes(budgetAuditItemVO.getDes());
				budgetAuditItemPO.setComment(budgetAuditItemVO.getComment());
				budgetAuditItemPO.setQuotationFunctionArea(new QuotationFunctionAreaPO(budgetAuditItemVO.getFunctionAreaId()));
				budgetAuditItemPO.setQuotationBigCategory(new QuotationBigCategoryPO(budgetAuditItemVO.getCategoryId()));
				budgetAuditItemPO.setMeasurementUnit(new MeasurementUnitPO(budgetAuditItemVO.getMeasurementUnitId()));
				budgetAuditItemPO.setWorkType(new WorkTypePO(budgetAuditItemVO.getWorkTypeId()));
				
				budgetAuditItemDao.save(budgetAuditItemPO);
			}
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void submitBudgetAuditItem(BudgetAuditVO budgetAuditVO, String currentUserId) throws FLException{
		budgetAuditItemDao.deleteBudgetAuditByOrderId(budgetAuditVO.getOrderId());
		
		if(budgetAuditVO.getBudgetAuditItems() != null){
			for(BudgetAuditItemVO budgetAuditItemVO : budgetAuditVO.getBudgetAuditItems()){
				BudgetAuditItemPO budgetAuditItemPO = new BudgetAuditItemPO();
				
				budgetAuditItemPO.setOrderId(budgetAuditItemVO.getOrderId());
				budgetAuditItemPO.setItemId(budgetAuditItemVO.getItemId());
				budgetAuditItemPO.setItemName(budgetAuditItemVO.getItemName());
				budgetAuditItemPO.setItemType(budgetAuditItemVO.getItemType());
				budgetAuditItemPO.setUnitPrice(budgetAuditItemVO.getUnitPrice());
				budgetAuditItemPO.setNum(budgetAuditItemVO.getNum());
				budgetAuditItemPO.setStatus(budgetAuditItemVO.getStatus());
				budgetAuditItemPO.setDes(budgetAuditItemVO.getDes());
				budgetAuditItemPO.setComment(budgetAuditItemVO.getComment());
				budgetAuditItemPO.setQuotationFunctionArea(new QuotationFunctionAreaPO(budgetAuditItemVO.getFunctionAreaId()));
				budgetAuditItemPO.setQuotationBigCategory(new QuotationBigCategoryPO(budgetAuditItemVO.getCategoryId()));
				budgetAuditItemPO.setMeasurementUnit(new MeasurementUnitPO(budgetAuditItemVO.getMeasurementUnitId()));
				budgetAuditItemPO.setWorkType(new WorkTypePO(budgetAuditItemVO.getWorkTypeId()));
				
				budgetAuditItemDao.save(budgetAuditItemPO);
			}
			
			StringBuffer contents = new StringBuffer();
			contents.append("您好,订单编号[");
			contents.append(budgetAuditVO.getOrderId());
			contents.append("]有新的扣款项.");

			DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(budgetAuditVO.getOrderId());
			MessageVO messageVO = new MessageVO();
			messageVO.setReceiver(new UserVO(decorationOrderPO.getDesignerPO().getUserId()));
			messageVO.setSender(new UserVO(currentUserId));
			messageVO.setType(MessagePO.MESSAGE_TYPE_BUDGET_AUDIT_STR);
			messageVO.setContents(contents.toString());
			
			messageService.sendMessage(messageVO);
		}
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void changeBudgetAuditItemForStatus(BudgetAuditItemVO budgetAuditItemVO, String currentUserId) throws FLException{
		BudgetAuditItemPO budgetAuditItemPO = budgetAuditItemDao.get(budgetAuditItemVO.getAuditId());
		
		budgetAuditItemPO.setStatus(budgetAuditItemVO.getStatus());
		budgetAuditItemPO.setComment(budgetAuditItemVO.getComment());
		
		budgetAuditItemDao.update(budgetAuditItemPO);

		String userSalaryType = "";
		if(budgetAuditItemVO.getStatus().equals(BudgetAuditItemPO.STATUS_CHARGEBACK_STR)){
			userSalaryType = UserSalaryPO.TYPE_PRICE_DEDUCTION_STR;
		}else {
			userSalaryType = UserSalaryPO.TYPE_REPLENISHMENT_STR;
		}
		
		StringBuffer comments = new StringBuffer();
		comments.append("预算审核扣款:订单编号[");
		comments.append(budgetAuditItemPO.getOrderId());
		comments.append("],报价项:[");
		comments.append(budgetAuditItemPO.getItemName());
		comments.append("]");
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(budgetAuditItemVO.getOrderId());
		UserSalaryVO userSalaryVO = new UserSalaryVO();
		userSalaryVO.setUserId(decorationOrderPO.getDesignerPO().getUserId());
		userSalaryVO.setType(userSalaryType);
		userSalaryVO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		userSalaryVO.setCreateUserId(currentUserId);
		userSalaryVO.setComments(comments.toString());
		userSalaryVO.setMoney(budgetAuditItemPO.getUnitPrice() * budgetAuditItemPO.getNum());
		
		userSalaryService.saveUserSalary(userSalaryVO);
		
		StringBuffer contents = new StringBuffer();
		contents.append("您好, 订单编号 [");
		contents.append(budgetAuditItemPO.getOrderId());
		contents.append("],报价项:[");
		contents.append(budgetAuditItemPO.getItemName());
		contents.append("],标记状态:[");
		contents.append(budgetAuditItemPO.getStatus());
		contents.append("],说明:[");
		contents.append(budgetAuditItemPO.getComment());
		contents.append("]");

		MessageVO messageVO = new MessageVO();
		messageVO.setReceiver(new UserVO(decorationOrderPO.getDesignerPO().getUserId()));
		messageVO.setSender(new UserVO(currentUserId));
		messageVO.setType(MessagePO.MESSAGE_TYPE_BUDGET_AUDIT_STR);
		messageVO.setContents(contents.toString());
		messageService.sendMessage(messageVO);
	}

}
