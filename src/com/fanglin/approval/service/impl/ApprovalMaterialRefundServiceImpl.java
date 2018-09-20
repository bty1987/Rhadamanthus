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
import java.util.Arrays;
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
import com.fanglin.material.dao.MaterialBalanceDao;
import com.fanglin.material.dao.MaterialDao;
import com.fanglin.material.dao.MaterialItemDao;
import com.fanglin.material.dao.MaterialRefundDao;
import com.fanglin.material.po.MaterialBalancePO;
import com.fanglin.material.po.MaterialItemPO;
import com.fanglin.material.po.MaterialPO;
import com.fanglin.material.po.MaterialRefundPO;
import com.fanglin.material.vo.MaterialItemVO;
import com.fanglin.payment.dao.MaterialPaymentDao;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.personel.dao.UserDao;
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
	
	@Autowired
	private MaterialDao materialDao;
	
	@Autowired
	private MaterialItemDao materialItemDao;
	
	@Autowired
	private MaterialRefundDao materialRefundDao;
	
	@Autowired
	private MaterialBalanceDao materialBalanceDao;
	
	@Autowired
	private MaterialPaymentDao materialPaymentDao;
	
	@Autowired
	private MessageService messageService;
	
	@Autowired
	private UserDao userDao;
	
	// 获取主材退货审批项信息
	@Override
	public List<ApprovalMaterialRefundItemVO> queryApprovalMaterialRefundItem(ApprovalVO approvalVO) throws FLException {
		
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
			
			approvalMaterialRefundItemVO = new ApprovalMaterialRefundItemVO(new MaterialItemVO());
			
			// 将"approvalMaterialRefundItemPO"赋值给"approvalMaterialRefundItemVO",并忽略'materialItem'属性
			BeanUtil.copyProperties(approvalMaterialRefundItemPO, approvalMaterialRefundItemVO, "materialItem");
			BeanUtil.copyProperties(approvalMaterialRefundItemPO.getMaterialItem(), approvalMaterialRefundItemVO.getMaterialItem());
			
			approvalMaterialRefundItemVOs.add(approvalMaterialRefundItemVO);
		}
		
		return approvalMaterialRefundItemVOs;
	}

	// 提交主材退货审批
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int submitApprovalForMaterialRefund(ApprovalVO approvalVO, ApprovalMaterialRefundVO approvalMaterialRefundVO, List<ApprovalMaterialRefundItemVO> approvalMaterialRefundItemVOs, String userId,int company) throws FLException {
		
		long mid = approvalMaterialRefundVO.getMid();
		float dis = 0;
		float disTotal = 0;
		
		List<String> packageNames = new ArrayList<String>();//新建套餐数组
		
		// 通过主材订单编号,查出主材退货审批单
		ApprovalPO approvalPO = approvalDao.queryApproval(ApprovalPO.APPROVAL_STATUS_INIT_INT,ApprovalPO.APPROVAL_TYPE_MATERIAL_REFUND_INT, String.valueOf(mid));
		
		if(approvalPO != null){
			throw new FLException(240004, "正在审批中,不能提交新审批");
		}
		
		// 通过主材订单编号查询主财订单
		MaterialPO materialPO = materialDao.get(mid);
		
		if(materialPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		// 通过主材订单编号,查询该主材付款信息
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentForInitByMid(mid);
		
		if(materialPaymentPOs.size() > 0){
			throw new FLException(240006, "存在未处理收款信息");
		}
		
		approvalPO = new ApprovalPO();
		BeanUtil.copyProperties(approvalVO, approvalPO,Arrays.asList("receiver","sender"));
		
		UserPO receiver = userDao.queryUserByUserId(approvalVO.getReceiver().getUserId());
		UserPO sender = userDao.queryUserByUserId(userId);
		
		String refundType = approvalMaterialRefundVO.getType() == MaterialPO.STATUS_TYPE_FULLREFUND_INT ? "全退" : approvalMaterialRefundVO.getType() == MaterialPO.STATUS_TYPE_DAODAN_INT ? "倒单" : "退货";
		
		approvalPO.setType(ApprovalPO.APPROVAL_TYPE_MATERIAL_REFUND_INT);//主材退货
		approvalPO.setStatus(ApprovalPO.APPROVAL_STATUS_INIT_INT);//初始
		approvalPO.setIdent(String.valueOf(mid));//主材订单编号
		approvalPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		//"订单号:%s,主材订单号:%s,品牌:%s,退款金额:%s,应退金额:%s,类型:%s"
		approvalPO.setContents(String.format(ApprovalPO.APPROVAL_CONTENTS_MATERIAL_REFUND_STR, materialPO.getOrderId(), materialPO.getNo(), materialPO.getBrand(), approvalMaterialRefundVO.getRefund(), approvalMaterialRefundVO.getReferMoney(), refundType));
		approvalPO.setReceiver(receiver);
		approvalPO.setSender(sender);
		approvalPO.setCompany(company);
		
		approvalDao.save(approvalPO);
		
		ApprovalMaterialRefundPO approvalMaterialRefundPO = new ApprovalMaterialRefundPO();
		approvalMaterialRefundPO.setAid(approvalPO.getAid());
		approvalMaterialRefundPO.setMid(mid);
		approvalMaterialRefundPO.setRefund(approvalMaterialRefundVO.getRefund());
		approvalMaterialRefundPO.setType(approvalMaterialRefundVO.getType());
		
		approvalMaterialRefundDao.save(approvalMaterialRefundPO);
		
		for(ApprovalMaterialRefundItemVO approvalMaterialRefundItemVO: approvalMaterialRefundItemVOs){
			MaterialItemPO materialItemPO = materialItemDao.get(approvalMaterialRefundItemVO.getMaterialItem().getMiid());
			
			if(materialItemPO == null){
				throw new FLException(180007, "主材订单不存在操作型号信息");
			}
			
			if(materialItemPO.getNum() >= approvalMaterialRefundItemVO.getNum() && materialItemPO.getTotal() >= approvalMaterialRefundItemVO.getTotal()){
				materialItemPO.setNum(Arith.sub(materialItemPO.getNum(), approvalMaterialRefundItemVO.getNum()));
				materialItemPO.setTotal(Arith.sub(materialItemPO.getTotal(), approvalMaterialRefundItemVO.getTotal()));
				dis = Arith.mul(materialItemPO.getSalePrice(),approvalMaterialRefundItemVO.getNum());
				disTotal = Arith.add(dis, disTotal);
			}else{
				throw new FLException(180008, "主材订单退货型号数量不足");
			}
			
			String packageName = materialItemPO.getPackageName();
			
			materialItemDao.update(materialItemPO);
			
			ApprovalMaterialRefundItemPO approvalMaterialRefundItemPO = new ApprovalMaterialRefundItemPO();
			
			approvalMaterialRefundItemPO.setNum(approvalMaterialRefundItemVO.getNum());//退货数量
			approvalMaterialRefundItemPO.setTotal(approvalMaterialRefundItemVO.getTotal());//退货金额
			approvalMaterialRefundItemPO.setAmrId(approvalMaterialRefundPO.getAmrId());//审批材料ID
			approvalMaterialRefundItemPO.setMid(mid);//主材订单编号
			approvalMaterialRefundItemPO.setPackageName(packageName);//套餐名
			approvalMaterialRefundItemPO.setMaterialItem(materialItemPO);//主材订单型号信息类
			
			approvalMaterialRefundItemDao.save(approvalMaterialRefundItemPO);
			
			if("".equals(packageName)){
				materialPO.setTotal(Arith.sub(materialPO.getTotal(), Arith.mul(approvalMaterialRefundItemVO.getNum(), materialItemPO.getPrice())));
			}else{
				if(!packageNames.contains(packageName)){ // contains -包含
					materialPO.setTotal(Arith.sub(materialPO.getTotal(), approvalMaterialRefundItemVO.getTotal()));
					
					packageNames.add(materialItemPO.getPackageName());
				}
			}
		}
		materialPO.setDistotal(Arith.sub(materialPO.getDistotal(), disTotal));

		messageService.sendMessage(approvalPO.getReceiver().getUserId(),approvalPO.getSender().getUserId(),approvalPO.getContents(), MessagePO.MESSAGE_TYPE_SEND_APPROVAL_STR,company);	

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
		MaterialPO materialPO = materialDao.get(approvalMaterialRefundPO.getMid());
		
		if(materialPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		MaterialPaymentPO materialPaymentPO = new MaterialPaymentPO();
		
		materialPaymentPO.setMaterial(materialPO);//主材订单信息类
		
		materialPaymentPO.setCategory(materialPO.getCategory());//品类
		materialPaymentPO.setBrand(materialPO.getBrand());//品牌
		
		materialPaymentPO.setCreater(approvalPO.getSender());
		materialPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		materialPaymentPO.setReferMoney(approvalMaterialRefundPO.getRefund());//退款金额
		materialPaymentPO.setPaymentType(MaterialPaymentPO.PAYMENTTYPE_TYPE_REJECT_INT);
		materialPaymentPO.setCompany(materialPO.getCompany());
		
		materialPaymentDao.save(materialPaymentPO);
		
		List<ApprovalMaterialRefundItemPO> approvalMaterialRefundItemPOs = approvalMaterialRefundItemDao.queryApprovalMaterialRefundItemByAmrId(approvalMaterialRefundPO.getAmrId());

		float refundMoney = 0;
		int balanceStatus = materialPO.getBalanceStatus();//结算状态
		int ident = new Random().nextInt(9999);
		List<String> materialItemPackageNameList = new ArrayList<String>();
		for(ApprovalMaterialRefundItemPO approvalMaterialRefundItemPO: approvalMaterialRefundItemPOs){	
			// 主材订单型号信息
			MaterialItemPO materialItemPO = approvalMaterialRefundItemPO.getMaterialItem();
			// 主材分批次退款类(用于主材订单型号信息管理)
			MaterialRefundPO materialRefundPO = new MaterialRefundPO();
			
			float num = approvalMaterialRefundItemPO.getNum();//退货数量
			float total = approvalMaterialRefundItemPO.getTotal();//退货金额
			
			float salePrice = materialItemPO.getSalePrice(); // 折扣价
			float price = materialItemPO.getPrice();//价位
			String packageName = materialItemPO.getPackageName();//套餐名
			BeanUtil.copyProperties(materialItemPO, materialRefundPO);
			
			materialRefundPO.setMpId(materialPaymentPO.getMpId());
			materialRefundPO.setIdent(ident);
			materialRefundPO.setNum(approvalMaterialRefundItemPO.getNum());
			materialRefundPO.setTotal(approvalMaterialRefundItemPO.getTotal());
			materialRefundPO.setStatus(MaterialRefundPO.STATUS_TYPE_REFUND_INT);
			materialRefundPO.setBalanceType(materialItemPO.getBalanceStatus());
			materialRefundPO.setComment("");
			
			materialRefundDao.save(materialRefundPO);
			
			if(balanceStatus == MaterialPO.BALANCE_STATUS_TYPE_PRE_INT || balanceStatus == MaterialPO.BALANCE_STATUS_TYPE_POST_INT){ // 预结算状态计算利润
				
				float prePoint = materialItemPO.getPrePoint();
				
				if("".equals(packageName)){ // 型号
					
					if(materialItemPO.getCalcType() == MaterialItemPO.CALCTYPE_TYPE_BASE_INT){
						// 利润 : (售价 - 预结算底价) * 数量 , 成本 : 预结算底价 * 数量
						refundMoney = Arith.sub(refundMoney, Arith.mul(Arith.sub(price, prePoint), num));
					}else if(materialItemPO.getCalcType() == MaterialItemPO.CALCTYPE_TYPE_POINT_INT){
						// 利润 : (售价 - 折扣价 * (1 - 预结算点位)) * 数量 , 成本 : 折扣价 * (1 - 预结算点位) * 数量
						refundMoney =  Arith.sub(refundMoney, Arith.mul(Arith.sub(Arith.mul(salePrice, prePoint), Arith.sub(salePrice, price)), num));
					}
				}else if(!materialItemPackageNameList.contains(packageName)){ // 套餐
					// 利润 : 退款总价 * 预结算点位 , 成本 : 退款总价 * (1 - 预结算点位)
					refundMoney = Arith.sub(refundMoney, Arith.mul(total, prePoint));
					materialItemPackageNameList.add(packageName);
				}
			}else if(balanceStatus == MaterialPO.BALANCE_STATUS_TYPE_POST_INT){ // 结算状态计算利润
				
				float postPoint = materialItemPO.getPostPoint();
				
				if("".equals(packageName)){
					if(materialItemPO.getCalcType() == MaterialItemPO.CALCTYPE_TYPE_BASE_INT){
						// 利润 : (售价 - 结算底价) * 数量 , 成本 : 结算底价 * 数量
						refundMoney = Arith.sub(refundMoney, Arith.mul(Arith.sub(price, postPoint), num));
					}else if(materialItemPO.getCalcType() == MaterialItemPO.CALCTYPE_TYPE_POINT_INT){
						// 利润 : (售价 - 折扣价 * (1 - 结算点位)) * 数量 , 成本 : 折扣价 * (1 - 结算点位) * 数量
						refundMoney = Arith.sub(refundMoney, Arith.mul(Arith.sub(Arith.mul(salePrice, postPoint), Arith.sub(salePrice, price)), num));
					}
				}else if(!materialItemPackageNameList.contains(packageName)){
					// 利润 : 退款总价 * 结算点位 , 成本 : 退款总价 * (1 - 结算点位)
					refundMoney = Arith.sub(refundMoney, Arith.mul(total, postPoint));
					
					materialItemPackageNameList.add(packageName);
				}
			}
		}
		
		if(balanceStatus == MaterialPO.BALANCE_STATUS_TYPE_PRE_INT || balanceStatus == MaterialPO.BALANCE_STATUS_TYPE_POST_INT){

			UserPO instore = userDao.queryUserByUserId(materialPO.getInstorer().getUserId());
			
			MaterialBalancePO materialBalancePO = new MaterialBalancePO();
			materialBalancePO.setMaterial(materialPO);//主材订单信息类
			materialBalancePO.setCreater(approvalPO.getSender());//发送人
			materialBalancePO.setInstorer(materialPO.getInstorer().getUserId() == null ? null : instore);//驻店编号(括号内为:三目运算符)
			materialBalancePO.setBalanceTime(DateUtil.getDateToTimestamp(new Date()));
			materialBalancePO.setBalance(refundMoney);//结算值 (利润)
			materialBalancePO.setDifference(refundMoney);//差值(既总额 - 结算值)
			materialBalancePO.setType(balanceStatus == MaterialPO.BALANCE_STATUS_TYPE_PRE_INT ? MaterialBalancePO.TYPE_SUB_INT : MaterialBalancePO.TYPE_SUBED_INT);//类型
			materialBalancePO.setStatus(MaterialBalancePO.STATUS_PRE_BALANCE_INT);//状态(0 -预结算)
			materialBalancePO.setIdent(ident);//退货识别
			materialBalancePO.setTotal(Arith.sub(0, approvalMaterialRefundPO.getRefund()));
			materialBalancePO.setMpId(materialPaymentPO.getMpId());
			materialBalanceDao.save(materialBalancePO);
		}
		
		materialDao.update(materialPO);
		
		return 0;
	}

	// 拒绝主材退款
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refuseForMaterialRefund(ApprovalPO approvalPO) throws FLException {
		
		float dis = 0;
		float disTotal = 0;
		
		ApprovalMaterialRefundPO approvalMaterialRefundPO = approvalMaterialRefundDao.queryApprovalMaterialRefundByAId(approvalPO.getAid());
		
		if(approvalMaterialRefundPO == null){
			throw new FLException(240003, "审批信息不完整");
		}
		
		MaterialPO materialPO = materialDao.get(approvalMaterialRefundPO.getMid());
		
		if(materialPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		List<String> packageNames = new ArrayList<String>();
		
		List<ApprovalMaterialRefundItemPO> approvalMaterialRefundItemPOs = approvalMaterialRefundItemDao.queryApprovalMaterialRefundItemByAmrId(approvalMaterialRefundPO.getAmrId());
		
		for(ApprovalMaterialRefundItemPO approvalMaterialRefundItemPO: approvalMaterialRefundItemPOs){
			MaterialItemPO materialItemPO = approvalMaterialRefundItemPO.getMaterialItem();
			
			if(materialItemPO == null){
				throw new FLException(180007, "主材订单不存在操作型号信息");
			}
			
			String packageName = materialItemPO.getPackageName();
			dis = Arith.mul(materialItemPO.getSalePrice(),approvalMaterialRefundItemPO.getNum());
			disTotal = Arith.add(dis, disTotal);
			
			materialItemPO.setNum(Arith.add(materialItemPO.getNum(), approvalMaterialRefundItemPO.getNum()));
			materialItemPO.setTotal(Arith.add(materialItemPO.getTotal(), approvalMaterialRefundItemPO.getTotal()));
			
			materialItemDao.update(materialItemPO);
			
			if("".equals(packageName)){
				materialPO.setTotal(Arith.add(materialPO.getTotal(), Arith.mul(approvalMaterialRefundItemPO.getNum(), materialItemPO.getPrice())));
			}else{
				if(!packageNames.contains(materialItemPO.getPackageName())){
					materialPO.setTotal(Arith.add(materialPO.getTotal(), approvalMaterialRefundItemPO.getTotal()));
					
					packageNames.add(materialItemPO.getPackageName());
				}
			}
		}
		materialPO.setDistotal(Arith.add(materialPO.getDistotal(), disTotal));
		return 0;
	}

}
