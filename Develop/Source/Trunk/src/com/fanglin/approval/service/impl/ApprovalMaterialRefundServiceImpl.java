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
import com.fanglin.material.dao.MaterialSubOrderBalanceDao;
import com.fanglin.material.dao.MaterialSubOrderDao;
import com.fanglin.material.dao.MaterialSubOrderItemDao;
import com.fanglin.material.dao.MaterialSubOrderRefundDao;
import com.fanglin.material.po.MaterialSubOrderBalancePO;
import com.fanglin.material.po.MaterialSubOrderItemPO;
import com.fanglin.material.po.MaterialSubOrderPO;
import com.fanglin.material.po.MaterialSubOrderRefundPO;
import com.fanglin.material.vo.MaterialSubOrderItemVO;
import com.fanglin.payment.dao.MaterialPaymentDao;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

/**
 * 审批材料退款Service(用于主材退货审批)
 * @author lenovo
 *
 */
@Service("approvalMaterialRefundService")
@Transactional(readOnly=true)
public class ApprovalMaterialRefundServiceImpl implements ApprovalMaterialRefundService {
	
	@Autowired
	private ApprovalDao approvalDao;
	
	@Autowired
	private ApprovalMaterialRefundDao approvalMaterialRefundDao;
	
	@Autowired
	private ApprovalMaterialRefundItemDao approvalMaterialRefundItemDao;
	
	// 主材订单信息DAO接口
	@Autowired
	private MaterialSubOrderDao materialSubOrderDao;
	
	// 主材订单型号信息DAO接口
	@Autowired
	private MaterialSubOrderItemDao materialSubOrderItemDao;
	
	// 主材分批次退款类DAO接口(用于主材订单型号信息管理)
	@Autowired
	private MaterialSubOrderRefundDao materialSubOrderRefundDao;
	
	// 主材订单结算功能DAO接口
	@Autowired
	private MaterialSubOrderBalanceDao materialSubOrderBalanceDao;
	
	// 主材付款DAO接口
	@Autowired
	private MaterialPaymentDao materialPaymentDao;
	
	// 消息Service接口
	@Autowired
	private MessageService messageService;
	
	// 获取主材退货审批项信息
	@Override
	public List<ApprovalMaterialRefundItemVO> queryApprovalForMaterialRefundItem(ApprovalVO approvalVO) throws FLException {
		
		ApprovalPO approvalPO = approvalDao.get(approvalVO.getAid());//通过VO中的审批信息ID获取该审批内容
		
		if(approvalPO == null){
			throw new FLException(240009, "审批信息不存在");
		}
		
		ApprovalMaterialRefundPO approvalMaterialRefundPO = approvalMaterialRefundDao.queryApprovalMaterialRefundByAId(approvalPO.getAid());//获取主材退货审批项信息
		
		if(approvalMaterialRefundPO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		// 通过审批装修退款类ID,查询审批材料退款项目
		List<ApprovalMaterialRefundItemPO> approvalMaterialRefundItemPOs = approvalMaterialRefundItemDao.queryApprovalMaterialRefundItemByAmrId(approvalMaterialRefundPO.getAmrId());
		List<ApprovalMaterialRefundItemVO> approvalMaterialRefundItemVOs = new ArrayList<ApprovalMaterialRefundItemVO>();
		
		ApprovalMaterialRefundItemVO approvalMaterialRefundItemVO;
		
		for(ApprovalMaterialRefundItemPO approvalMaterialRefundItemPO: approvalMaterialRefundItemPOs){
			
			approvalMaterialRefundItemVO = new ApprovalMaterialRefundItemVO(new MaterialSubOrderItemVO());
			
			// 将"approvalMaterialRefundItemPO"赋值给"approvalMaterialRefundItemVO",并忽略'materialSubOrderItem'属性
			BeanUtil.copyProperties(approvalMaterialRefundItemPO, approvalMaterialRefundItemVO, "materialSubOrderItem");
			BeanUtil.copyProperties(approvalMaterialRefundItemPO.getMaterialSubOrderItem(), approvalMaterialRefundItemVO.getMaterialSubOrderItem());
			
			approvalMaterialRefundItemVOs.add(approvalMaterialRefundItemVO);
		}
		
		return approvalMaterialRefundItemVOs;
	}

	// 提交主材退货审批
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForMaterialRefund(ApprovalVO approvalVO, ApprovalMaterialRefundVO approvalMaterialRefundVO, List<ApprovalMaterialRefundItemVO> approvalMaterialRefundItemVOs, String userId) throws FLException {
		
		long msoId = approvalMaterialRefundVO.getMsoId();
		
		List<String> packageNames = new ArrayList<String>();//新建套餐数组
		
		// 通过主材订单编号,查出主材退货审批单
		ApprovalPO approvalPO = approvalDao.queryApprovalForInitByTypeAIdent(ApprovalPO.APPROVAL_TYPE_MATERIAL_REFUND_INT, String.valueOf(msoId));
		
		if(approvalPO != null){
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}
		
		// 通过主材订单编号查询主财订单
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(msoId);
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		// 通过主材订单编号,查询该主材付款信息
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentForInitByMsoId(msoId);
		
		if(materialPaymentPOs.size() > 0){
			throw new FLException(240006, "存在未处理收款信息");
		}
		
		approvalPO = new ApprovalPO();
		BeanUtil.copyProperties(approvalVO, approvalPO);
		
		String refundType = approvalMaterialRefundVO.getType() == MaterialSubOrderPO.STATUS_TYPE_FULLREFUND_INT ? "全退" : approvalMaterialRefundVO.getType() == MaterialSubOrderPO.STATUS_TYPE_DAODAN_INT ? "倒单" : "退货";
		
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_MATERIAL_REFUND_INT);//主材退货
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);//初始
		approvalPO.setIdent(String.valueOf(msoId));//主材订单编号
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		//"订单号:%s,主材订单号:%s,品牌:%s,退款金额:%s,应退金额:%s,类型:%s"
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_MATERIAL_REFUND_STR, materialSubOrderPO.getOrderId(), materialSubOrderPO.getMsoNo(), materialSubOrderPO.getMaterialBrand(), approvalMaterialRefundVO.getRefund(), approvalMaterialRefundVO.getReferMoney(), refundType));
		approvalPO.setReceiver(new UserPO(approvalVO.getReceiverId()));
		approvalPO.setSender(new UserPO(userId));
		
		approvalDao.save(approvalPO);
		
		ApprovalMaterialRefundPO approvalMaterialRefundPO = new ApprovalMaterialRefundPO();
		approvalMaterialRefundPO.setAid(approvalPO.getAid());
		approvalMaterialRefundPO.setMsoId(msoId);
		approvalMaterialRefundPO.setRefund(approvalMaterialRefundVO.getRefund());
		approvalMaterialRefundPO.setType(approvalMaterialRefundVO.getType());
		
		approvalMaterialRefundDao.save(approvalMaterialRefundPO);
		
		for(ApprovalMaterialRefundItemVO approvalMaterialRefundItemVO: approvalMaterialRefundItemVOs){
			MaterialSubOrderItemPO materialSubOrderItemPO = materialSubOrderItemDao.get(approvalMaterialRefundItemVO.getMaterialSubOrderItem().getMsoiId());
			
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
			
			approvalMaterialRefundItemPO.setNum(approvalMaterialRefundItemVO.getNum());//退货数量
			approvalMaterialRefundItemPO.setTotal(approvalMaterialRefundItemVO.getTotal());//退货金额
			approvalMaterialRefundItemPO.setAmrId(approvalMaterialRefundPO.getAmrId());//审批材料ID
			approvalMaterialRefundItemPO.setMsoId(msoId);//主材订单编号
			approvalMaterialRefundItemPO.setPackageName(packageName);//套餐名
			approvalMaterialRefundItemPO.setMaterialSubOrderItem(materialSubOrderItemPO);//主材订单型号信息类
			
			approvalMaterialRefundItemDao.save(approvalMaterialRefundItemPO);
			
			if("".equals(packageName)){
				materialSubOrderPO.setTotal(Arith.sub(materialSubOrderPO.getTotal(), Arith.mul(approvalMaterialRefundItemVO.getNum(), materialSubOrderItemPO.getPrice())));
			}else{
				if(!packageNames.contains(packageName)){ // contains -包含
					materialSubOrderPO.setTotal(Arith.sub(materialSubOrderPO.getTotal(), approvalMaterialRefundItemVO.getTotal()));
					
					packageNames.add(materialSubOrderItemPO.getPackageName());
				}
			}
		}
		
		MessageVO messageVO = new MessageVO(approvalPO.getReceiver().getUserId(), approvalPO.getSender().getUserId(), MessagePO.MESSAGE_TYPE_APPROVAL_STR, "新增一条审批信息,请查收.");
		
		messageService.sendMessage(messageVO);
		
		return 0;
	}

	// 批准主材退款
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int approvalForMaterialRefund(ApprovalPO approvalPO) throws FLException {
		
		// 通过审批信息ID,查看主材退货审批
		ApprovalMaterialRefundPO approvalMaterialRefundPO = approvalMaterialRefundDao.queryApprovalMaterialRefundByAId(approvalPO.getAid());
		
		if(approvalMaterialRefundPO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		// 通过审批材料退款类中的主材订单ID,查询主材订单编号内容
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(approvalMaterialRefundPO.getMsoId());
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		MaterialPaymentPO materialPaymentPO = new MaterialPaymentPO();
		
		materialPaymentPO.setMaterialSubOrder(materialSubOrderPO);//主材订单信息类
		materialPaymentPO.setMsoNo(materialSubOrderPO.getMsoNo());//主材订单编号
		
		materialPaymentPO.setMaterialType(materialSubOrderPO.getMaterialType());//品类
		materialPaymentPO.setMaterialBrand(materialSubOrderPO.getMaterialBrand());//品牌
		
		materialPaymentPO.setCreateUserId(approvalPO.getSender().getUserId());
		materialPaymentPO.setCreateUserName(approvalPO.getSender().getCurrentName());
		
		materialPaymentPO.setCustomerId(materialSubOrderPO.getCustomerId());//客户编号
		materialPaymentPO.setCustomerName(materialSubOrderPO.getCustomerName());//客户名
		
		materialPaymentPO.setReferMoney(approvalMaterialRefundPO.getRefund());//退款金额
		materialPaymentPO.setPaymentType(MaterialPaymentPO.PAYMENTTYPE_TYPE_REJECT_INT);
		
		materialPaymentDao.save(materialPaymentPO);
		
		List<ApprovalMaterialRefundItemPO> approvalMaterialRefundItemPOs = approvalMaterialRefundItemDao.queryApprovalMaterialRefundItemByAmrId(approvalMaterialRefundPO.getAmrId());

		float refundMoney = 0;
		int balanceStatus = materialSubOrderPO.getBalanceStatus();//结算状态
		int ident = new Random().nextInt(9999);
		List<String> materialSubOrderItemPackageNameList = new ArrayList<String>();
		
		for(ApprovalMaterialRefundItemPO approvalMaterialRefundItemPO: approvalMaterialRefundItemPOs){
			// 主材订单型号信息
			MaterialSubOrderItemPO materialSubOrderItemPO = approvalMaterialRefundItemPO.getMaterialSubOrderItem();
			// 主材分批次退款类(用于主材订单型号信息管理)
			MaterialSubOrderRefundPO materialSubOrderRefundPO = new MaterialSubOrderRefundPO();
			
			float num = approvalMaterialRefundItemPO.getNum();//退货数量
			float total = approvalMaterialRefundItemPO.getTotal();//退货金额
			
			float salePrice = materialSubOrderItemPO.getSalePrice(); // 折扣价
			float price = materialSubOrderItemPO.getPrice();//价位
			String packageName = materialSubOrderItemPO.getPackageName();//套餐名
			
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
			
			if(balanceStatus == MaterialSubOrderPO.BALANCE_STATUS_TYPE_PRE_INT || balanceStatus == MaterialSubOrderPO.BALANCE_STATUS_TYPE_POST_INT){ // 预结算状态计算利润
				
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
		
		if(balanceStatus == MaterialSubOrderPO.BALANCE_STATUS_TYPE_PRE_INT || balanceStatus == MaterialSubOrderPO.BALANCE_STATUS_TYPE_POST_INT){
			
			MaterialSubOrderBalancePO materialSubOrderBalancePO = new MaterialSubOrderBalancePO();
			materialSubOrderBalancePO.setMaterialSubOrder(materialSubOrderPO);//主材订单信息类
			materialSubOrderBalancePO.setCreater(approvalPO.getSender());//发送人
			materialSubOrderBalancePO.setInstorer(materialSubOrderPO.getInstoreId() == null ? null : new UserPO(materialSubOrderPO.getInstoreId()));//驻店编号(括号内为:三目运算符)
			materialSubOrderBalancePO.setBalanceTime(DateUtil.getDateToTimestamp(new Date()));
			materialSubOrderBalancePO.setBalance(refundMoney);//结算值 (利润)
			materialSubOrderBalancePO.setDifference(refundMoney);//差值(既总额 - 结算值)
			materialSubOrderBalancePO.setType(balanceStatus == MaterialSubOrderPO.BALANCE_STATUS_TYPE_PRE_INT ? MaterialSubOrderBalancePO.TYPE_SUB_INT : MaterialSubOrderBalancePO.TYPE_SUBED_INT);//类型
			materialSubOrderBalancePO.setStatus(MaterialSubOrderBalancePO.STATUS_PRE_BALANCE_INT);//状态(0 -预结算)
			materialSubOrderBalancePO.setIdent(ident);//退货识别
			
			materialSubOrderBalanceDao.save(materialSubOrderBalancePO);
		}
		
		if(approvalMaterialRefundPO.getType() != 0){
			materialSubOrderPO.setStatus(approvalMaterialRefundPO.getType());
		}
		
		materialSubOrderPO.setProfit(Arith.add(materialSubOrderPO.getProfit(), refundMoney));
		
		materialSubOrderDao.update(materialSubOrderPO);
		
		return 0;
	}

	// 拒绝主材退款
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
			MaterialSubOrderItemPO materialSubOrderItemPO = approvalMaterialRefundItemPO.getMaterialSubOrderItem();
			
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
