/**
 * @File Name		: ApprovalMaterialRefundServiceImpl.java
 * @Package   	: com.fanglin.approval.service.impl
 * @Version		: 1.0
 * @Date			: 2015-11-13
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.approval.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.approval.dao.ApprovalMaterialRefundDao;
import com.fanglin.approval.dao.ApprovalMaterialRefundItemDao;
import com.fanglin.approval.po.ApprovalMaterialRefundItemPO;
import com.fanglin.approval.po.ApprovalMaterialRefundPO;
import com.fanglin.approval.po.ApprovalPO;
import com.fanglin.approval.service.ApprovalMaterialRefundService;
import com.fanglin.approval.vo.ApprovalMaterialRefundItemVO;
import com.fanglin.approval.vo.ApprovalMaterialRefundVO;
import com.fanglin.approval.vo.ApprovalVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.material.dao.MaterialSubOrderDao;
import com.fanglin.material.dao.MaterialSubOrderItemDao;
import com.fanglin.material.dao.MaterialSubOrderPostBalanceDao;
import com.fanglin.material.dao.MaterialSubOrderPreBalanceDao;
import com.fanglin.material.dao.MaterialSubOrderRefundDao;
import com.fanglin.material.po.MaterialSubOrderItemPO;
import com.fanglin.material.po.MaterialSubOrderPO;
import com.fanglin.material.po.MaterialSubOrderPostBalancePO;
import com.fanglin.material.po.MaterialSubOrderPreBalancePO;
import com.fanglin.material.po.MaterialSubOrderRefundPO;
import com.fanglin.payment.dao.MaterialPaymentDao;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("approvalMaterialRefundService")
@Transactional(readOnly=true)
public class ApprovalMaterialRefundServiceImpl implements ApprovalMaterialRefundService {
	
	@Autowired
	private ApprovalDao approvalDao;
	
	@Autowired
	private ApprovalMaterialRefundDao approvalMaterialRefundDao;
	
	@Autowired
	private ApprovalMaterialRefundItemDao approvalMaterialRefundItemDao;
	
	@Autowired
	private MaterialSubOrderDao materialSubOrderDao;
	
	@Autowired
	private MaterialSubOrderItemDao materialSubOrderItemDao;
	
	@Autowired
	private MaterialSubOrderRefundDao materialSubOrderRefundDao;
	
	@Autowired
	private MaterialSubOrderPreBalanceDao materialSubOrderPreBalanceDao;
	
	@Autowired
	private MaterialSubOrderPostBalanceDao materialSubOrderPostBalanceDao;
	
	@Autowired
	private MaterialPaymentDao materialPaymentDao;
	
	@Autowired
	private MessageService messageService;
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForMaterialRefund(ApprovalVO approvalVO, ApprovalMaterialRefundVO approvalMaterialRefundVO, List<ApprovalMaterialRefundItemVO> approvalMaterialRefundItemVOs, String userId) throws FLException {
		
		long msoId = approvalMaterialRefundVO.getMsoId();
		
		List<String> packageNames = new ArrayList<String>();
		
		ApprovalPO approvalPO = approvalDao.queryApprovalForInitByTypeAIdent(ApprovalPO.APPROVAL_TYPE_MATERIAL_REFUND_INT, String.valueOf(msoId));
		
		if(approvalPO != null){
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(msoId);
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		approvalPO = new ApprovalPO();
		BeanUtil.copyProperties(approvalVO, approvalPO);
		
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_MATERIAL_REFUND_INT);
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);
		approvalPO.setIdent(String.valueOf(msoId));
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_MATERIAL_REFUND_STR, materialSubOrderPO.getOrderId(), materialSubOrderPO.getMsoNo(), materialSubOrderPO.getMaterialBrand(), approvalMaterialRefundVO.getRefund()));
		approvalPO.setReceiver(new UserPO(approvalVO.getReceiverId()));
		approvalPO.setSender(new UserPO(userId));
		
		approvalDao.save(approvalPO);
		
		ApprovalMaterialRefundPO approvalMaterialRefundPO = new ApprovalMaterialRefundPO();
		approvalMaterialRefundPO.setAid(approvalPO.getAid());
		approvalMaterialRefundPO.setMsoId(msoId);
		approvalMaterialRefundPO.setRefund(approvalMaterialRefundVO.getRefund());
		
		approvalMaterialRefundDao.save(approvalMaterialRefundPO);
		
		for(ApprovalMaterialRefundItemVO approvalMaterialRefundItemVO: approvalMaterialRefundItemVOs){
			MaterialSubOrderItemPO materialSubOrderItemPO = materialSubOrderItemDao.get(approvalMaterialRefundItemVO.getMsoiId());
			
			if(materialSubOrderItemPO == null){
				throw new FLException(180007, "主材订单不存在操作型号信息");
			}
			
			if(materialSubOrderItemPO.getNum() >= approvalMaterialRefundItemVO.getNum() && materialSubOrderItemPO.getTotal() >= approvalMaterialRefundItemVO.getTotal()){
				materialSubOrderItemPO.setNum(Arith.sub(materialSubOrderItemPO.getNum(), approvalMaterialRefundItemVO.getNum()));
				materialSubOrderItemPO.setTotal(Arith.sub(materialSubOrderItemPO.getTotal(), approvalMaterialRefundItemVO.getTotal()));
			}else{
				throw new FLException(180008, "主材订单退货型号数量不足");
			}
			
			String packageName = materialSubOrderItemPO.getPackageName();
			
			materialSubOrderItemDao.update(materialSubOrderItemPO);
			
			ApprovalMaterialRefundItemPO approvalMaterialRefundItemPO = new ApprovalMaterialRefundItemPO();
			BeanUtil.copyProperties(approvalMaterialRefundItemVO, approvalMaterialRefundItemPO);
			
			approvalMaterialRefundItemPO.setAmrId(approvalMaterialRefundPO.getAmrId());
			approvalMaterialRefundItemPO.setMsoId(msoId);
			approvalMaterialRefundItemPO.setPackageName(packageName);
			
			approvalMaterialRefundItemDao.save(approvalMaterialRefundItemPO);
			
			if("".equals(packageName)){
				materialSubOrderPO.setTotal(Arith.sub(materialSubOrderPO.getTotal(), Arith.mul(approvalMaterialRefundItemVO.getNum(), materialSubOrderItemPO.getPrice())));
			}else{
				if(!packageNames.contains(packageName)){
					materialSubOrderPO.setTotal(Arith.sub(materialSubOrderPO.getTotal(), approvalMaterialRefundItemVO.getTotal()));
					
					packageNames.add(materialSubOrderItemPO.getPackageName());
				}
			}
		}
		
		MessageVO messageVO = new MessageVO(approvalPO.getReceiver().getUserId(), approvalPO.getSender().getUserId(), MessagePO.MESSAGE_TYPE_APPROVAL_STR, "新增一条审批信息,请查收.");
		
		messageService.sendMessage(messageVO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int approvalForMaterialRefund(ApprovalPO approvalPO) throws FLException {
		
		ApprovalMaterialRefundPO approvalMaterialRefundPO = approvalMaterialRefundDao.queryApprovalMaterialRefundByAId(approvalPO.getAid());
		
		if(approvalMaterialRefundPO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(approvalMaterialRefundPO.getMsoId());
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		MaterialPaymentPO materialPaymentPO = new MaterialPaymentPO();
		
		materialPaymentPO.setMsoId(materialSubOrderPO.getMsoId());
		materialPaymentPO.setMsoNo(materialSubOrderPO.getMsoNo());
		
		materialPaymentPO.setMaterialType(materialSubOrderPO.getMaterialType());
		materialPaymentPO.setMaterialBrand(materialSubOrderPO.getMaterialBrand());
		
		materialPaymentPO.setCreateUserId(approvalPO.getSender().getUserId());
		materialPaymentPO.setCreateUserName(approvalPO.getSender().getCurrentName());
		
		materialPaymentPO.setCustomerId(materialSubOrderPO.getCustomerId());
		materialPaymentPO.setCustomerName(materialSubOrderPO.getCustomerName());
		
		materialPaymentPO.setReferMoney(approvalMaterialRefundPO.getRefund());
		materialPaymentPO.setPaymentType(MaterialPaymentPO.PAYMENTTYPE_TYPE_REJECT_INT);
		
		materialPaymentDao.save(materialPaymentPO);
		
		List<ApprovalMaterialRefundItemPO> approvalMaterialRefundItemPOs = approvalMaterialRefundItemDao.queryApprovalMaterialRefundItemByAmrId(approvalMaterialRefundPO.getAmrId());

		float refundMoney = 0;
		int balanceStatus = materialSubOrderPO.getBalanceStatus();
		int ident = new Random().nextInt(9999);
		List<String> materialSubOrderItemPackageNameList = new ArrayList<String>();
		
		for(ApprovalMaterialRefundItemPO approvalMaterialRefundItemPO: approvalMaterialRefundItemPOs){
			MaterialSubOrderItemPO materialSubOrderItemPO = materialSubOrderItemDao.get(approvalMaterialRefundItemPO.getMsoiId());
			MaterialSubOrderRefundPO materialSubOrderRefundPO = new MaterialSubOrderRefundPO();
			
			float num = approvalMaterialRefundItemPO.getNum();
			float total = approvalMaterialRefundItemPO.getTotal();
			
			float salePrice = materialSubOrderItemPO.getSalePrice(); // 折扣价
			float price = materialSubOrderItemPO.getPrice();
			String packageName = materialSubOrderItemPO.getPackageName();
			
			BeanUtil.copyProperties(materialSubOrderItemPO, materialSubOrderRefundPO);
			materialSubOrderRefundPO.setMpId(materialPaymentPO.getMpId());
			materialSubOrderRefundPO.setIdent(ident);
			materialSubOrderRefundPO.setNum(approvalMaterialRefundItemPO.getNum());
			materialSubOrderRefundPO.setTotal(approvalMaterialRefundItemPO.getTotal());
			materialSubOrderRefundPO.setStatus(MaterialSubOrderRefundPO.STATUS_TYPE_REFUND_INT);
			materialSubOrderRefundPO.setBalanceType(materialSubOrderItemPO.getBalanceStatus());
			materialSubOrderRefundPO.setRefundDes("");
			
			materialSubOrderRefundPO.setDpbsId(-1);
			
			materialSubOrderRefundDao.save(materialSubOrderRefundPO);
			
			if(balanceStatus == MaterialSubOrderPO.BALANCE_STATUS_TYPE_PRE_INT){ // 预结算状态计算利润
				
				float prePoint = materialSubOrderItemPO.getPrePoint();
				
				if("".equals(packageName)){ // 型号
					
					if(materialSubOrderItemPO.getCalcType() == MaterialSubOrderItemPO.CALCTYPE_TYPE_BASE_INT){
						// 利润 : (售价 - 预结算底价) * 数量 , 成本 : 预结算底价 * 数量
						refundMoney = Arith.sub(refundMoney, Arith.mul(Arith.sub(price, prePoint), num));
					}else if(materialSubOrderItemPO.getCalcType() == MaterialSubOrderItemPO.CALCTYPE_TYPE_POINT_INT){
						// 利润 : (售价 - 折扣价 * (1 - 预结算点位)) * 数量 , 成本 : 折扣价 * (1 - 预结算点位) * 数量
						refundMoney =  Arith.sub(refundMoney, Arith.mul(Arith.sub(Arith.mul(salePrice, prePoint), Arith.sub(salePrice, price)), num));
					}
				}else if(!materialSubOrderItemPackageNameList.contains(packageName)){ // 套餐
					// 利润 : 退款总价 * 预结算点位 , 成本 : 退款总价 * (1 - 预结算点位)
					refundMoney = Arith.sub(refundMoney, Arith.mul(total, prePoint));
					
					materialSubOrderItemPackageNameList.add(packageName);
				}
			}else if(balanceStatus == MaterialSubOrderPO.BALANCE_STATUS_TYPE_POST_INT){ // 结算状态计算利润
				
				float postPoint = materialSubOrderItemPO.getPostPoint();
				
				if("".equals(packageName)){
					if(materialSubOrderItemPO.getCalcType() == MaterialSubOrderItemPO.CALCTYPE_TYPE_BASE_INT){
						// 利润 : (售价 - 结算底价) * 数量 , 成本 : 结算底价 * 数量
						refundMoney = Arith.sub(refundMoney, Arith.mul(Arith.sub(price, postPoint), num));
					}else if(materialSubOrderItemPO.getCalcType() == MaterialSubOrderItemPO.CALCTYPE_TYPE_POINT_INT){
						// 利润 : (售价 - 折扣价 * (1 - 结算点位)) * 数量 , 成本 : 折扣价 * (1 - 结算点位) * 数量
						refundMoney = Arith.sub(refundMoney, Arith.mul(Arith.sub(Arith.mul(salePrice, postPoint), Arith.sub(salePrice, price)), num));
					}
				}else if(!materialSubOrderItemPackageNameList.contains(packageName)){
					// 利润 : 退款总价 * 结算点位 , 成本 : 退款总价 * (1 - 结算点位)
					refundMoney = Arith.sub(refundMoney, Arith.mul(total, postPoint));
					
					materialSubOrderItemPackageNameList.add(packageName);
				}
			}
		}
		
		if(balanceStatus == MaterialSubOrderPO.BALANCE_STATUS_TYPE_PRE_INT){
			MaterialSubOrderPreBalancePO materialSubOrderPreBalancePO = new MaterialSubOrderPreBalancePO();
			materialSubOrderPreBalancePO.setMsoId(materialSubOrderPO.getMsoId());
			materialSubOrderPreBalancePO.setMsoNo(materialSubOrderPO.getMsoNo());
			materialSubOrderPreBalancePO.setUserId(approvalPO.getSender().getUserId());
			materialSubOrderPreBalancePO.setUserName(approvalPO.getSender().getUserName());
			materialSubOrderPreBalancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			materialSubOrderPreBalancePO.setPreBalance(refundMoney);
			
			materialSubOrderPreBalanceDao.save(materialSubOrderPreBalancePO);
		}else if(balanceStatus == MaterialSubOrderPO.BALANCE_STATUS_TYPE_POST_INT){
			MaterialSubOrderPostBalancePO materialSubOrderPostBalancePO = new MaterialSubOrderPostBalancePO();
			materialSubOrderPostBalancePO.setMsoId(materialSubOrderPO.getMsoId());
			materialSubOrderPostBalancePO.setMsoNo(materialSubOrderPO.getMsoNo());
			materialSubOrderPostBalancePO.setUserId(approvalPO.getSender().getUserId());
			materialSubOrderPostBalancePO.setUserName(approvalPO.getSender().getUserName());
			materialSubOrderPostBalancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			materialSubOrderPostBalancePO.setPostBalance(refundMoney);
			
			materialSubOrderPostBalanceDao.save(materialSubOrderPostBalancePO);
		}
		
		materialSubOrderPO.setProfit(Arith.add(materialSubOrderPO.getProfit(), refundMoney));
		
		materialSubOrderDao.update(materialSubOrderPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refuseForMaterialRefund(ApprovalPO approvalPO) throws FLException {
		
		ApprovalMaterialRefundPO approvalMaterialRefundPO = approvalMaterialRefundDao.queryApprovalMaterialRefundByAId(approvalPO.getAid());
		
		if(approvalMaterialRefundPO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(approvalMaterialRefundPO.getMsoId());
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		List<String> packageNames = new ArrayList<String>();
		
		List<ApprovalMaterialRefundItemPO> approvalMaterialRefundItemPOs = approvalMaterialRefundItemDao.queryApprovalMaterialRefundItemByAmrId(approvalMaterialRefundPO.getAmrId());
		
		for(ApprovalMaterialRefundItemPO approvalMaterialRefundItemPO: approvalMaterialRefundItemPOs){
			MaterialSubOrderItemPO materialSubOrderItemPO = materialSubOrderItemDao.get(approvalMaterialRefundItemPO.getMsoiId());
			
			if(materialSubOrderItemPO == null){
				throw new FLException(180007, "主材订单不存在操作型号信息");
			}
			
			String packageName = materialSubOrderItemPO.getPackageName();
			
			materialSubOrderItemPO.setNum(Arith.add(materialSubOrderItemPO.getNum(), approvalMaterialRefundItemPO.getNum()));
			materialSubOrderItemPO.setTotal(Arith.add(materialSubOrderItemPO.getTotal(), approvalMaterialRefundItemPO.getTotal()));
			
			materialSubOrderItemDao.update(materialSubOrderItemPO);
			
			if("".equals(packageName)){
				materialSubOrderPO.setTotal(Arith.add(materialSubOrderPO.getTotal(), Arith.mul(approvalMaterialRefundItemPO.getNum(), materialSubOrderItemPO.getPrice())));
			}else{
				if(!packageNames.contains(materialSubOrderItemPO.getPackageName())){
					materialSubOrderPO.setTotal(Arith.add(materialSubOrderPO.getTotal(), approvalMaterialRefundItemPO.getTotal()));
					
					packageNames.add(materialSubOrderItemPO.getPackageName());
				}
			}
		}
		
		return 0;
	}

}
