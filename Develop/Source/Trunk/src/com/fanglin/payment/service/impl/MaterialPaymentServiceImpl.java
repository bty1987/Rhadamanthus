/**
 * @File Name		: MaterialPaymentServiceImpl.java
 * @Package   	: com.fanglin.service.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.ServiceRecordDao;
import com.fanglin.common.po.ServiceRecordPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.CustomerDao;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.material.dao.MaterialSubOrderDao;
import com.fanglin.material.dao.MaterialSubOrderRefundDao;
import com.fanglin.material.po.MaterialSubOrderPO;
import com.fanglin.material.po.MaterialSubOrderRefundPO;
import com.fanglin.material.vo.MaterialSubOrderVO;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.MaterialPaymentDao;
import com.fanglin.payment.dao.MaterialReceiptDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.payment.po.MaterialReceiptPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.payment.service.AdvancePaymentService;
import com.fanglin.payment.service.MaterialPaymentService;
import com.fanglin.payment.vo.MaterialPaymentVO;
import com.fanglin.payment.vo.MaterialReceiptVO;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.report.service.MaterialRankService;
import com.fanglin.report.service.MaterialReportService;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("materialPaymentService")
@Transactional(readOnly=true)
public class MaterialPaymentServiceImpl implements MaterialPaymentService {
	
	@Autowired
	private MaterialPaymentDao materialPaymentDao;
	
	@Autowired
	private MaterialReceiptDao materialReceiptDao;
	
	@Autowired
	private AdvancePaymentDao advancePaymentDao;
	
	@Autowired
	private AdvancePaymentService advancePaymentService;
	
	@Autowired
	private MaterialSubOrderDao materialSubOrderDao;
	
	@Autowired
	private MaterialSubOrderRefundDao materialSubOrderRefundDao;
	
//	@Autowired
//	private FinanceService financeService;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private CustomerDao customerDao;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
//	@Autowired
//	private DecorationActivityItemDao decorationActivityItemDao;
	
	@Autowired
	private ServiceRecordDao serviceRecordDao;
	
	@Autowired
	private MaterialReportService materialReportService;
	
	@Autowired
	private MaterialRankService materialRankService;
	
	@Override
	public void pageMaterialPaymentForInit(Paging paging, List<Filter> filters) {
		
		if(filters.size() == 0) return;
		
		List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.pageMaterialPaymentForStatus(paging, filters, MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT, "eq");
		
		MaterialSubOrderPO materialSubOrderPO;
		MaterialPaymentVO materialPaymentVO;
		
		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){
			
			materialPaymentVO = new MaterialPaymentVO();
			
			BeanUtil.copyProperties(materialPaymentPO, materialPaymentVO);

			materialSubOrderPO = materialPaymentPO.getMaterialSubOrder();
			
			materialPaymentVO.setOrderId(materialSubOrderPO.getOrderId());
			materialPaymentVO.setOrderAddr(materialSubOrderPO.getOrderAddr());
			materialPaymentVO.setMsoId(materialSubOrderPO.getMsoId());
			
			materialPaymentVOs.add(materialPaymentVO);
		}
		
		paging.setData(materialPaymentVOs);
	}

	@Override
	public void pageMaterialPaymentForCollect(Paging paging, List<Filter> filters){
		
		if(filters.size() == 0) return;
		
		List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();
		
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.pageMaterialPaymentForStatus(paging, filters, MaterialPaymentPO.PAYMENTSTATUS_TYPE_COLLECT_INT, "eq");
		
		MaterialSubOrderPO materialSubOrderPO;
		MaterialPaymentVO materialPaymentVO;
		
		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){
			
			materialPaymentVO = new MaterialPaymentVO();
			
			BeanUtil.copyProperties(materialPaymentPO, materialPaymentVO);

			if(materialPaymentPO.getMaterialReceipt() != null){
				BeanUtil.copyProperties(materialPaymentPO.getMaterialReceipt(), materialPaymentVO);
			}
			
			materialSubOrderPO = materialPaymentPO.getMaterialSubOrder();
			
			materialPaymentVO.setOrderId(materialSubOrderPO.getOrderId());
			materialPaymentVO.setOrderAddr(materialSubOrderPO.getOrderAddr());
			
			materialPaymentVOs.add(materialPaymentVO);
		}
		
		paging.setData(materialPaymentVOs);
	}

	@Override
	public void pageMaterialPaymentForConfirm(Paging paging, List<Filter> filters){
		
		if(filters.size() == 0) return;
		
		List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();
		
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.pageMaterialPaymentForStatus(paging, filters, MaterialPaymentPO.PAYMENTSTATUS_TYPE_CONFIRM_INT, "eq");
		
		MaterialSubOrderPO materialSubOrderPO;
		MaterialPaymentVO materialPaymentVO;
		
		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){
			
			materialPaymentVO = new MaterialPaymentVO();
			
			BeanUtil.copyProperties(materialPaymentPO, materialPaymentVO);

			if(materialPaymentPO.getMaterialReceipt() != null){
				BeanUtil.copyProperties(materialPaymentPO.getMaterialReceipt(), materialPaymentVO);
			}
			
			materialSubOrderPO = materialPaymentPO.getMaterialSubOrder();
			
			materialPaymentVO.setOrderId(materialSubOrderPO.getOrderId());
			materialPaymentVO.setOrderAddr(materialSubOrderPO.getOrderAddr());
			
			materialPaymentVOs.add(materialPaymentVO);
		}
		
		paging.setData(materialPaymentVOs);
	}

	@Override
	public void pageMaterialPaymentForNotInit(Paging paging, List<Filter> filters){
		
		if(filters.size() == 0) return ;
		
		List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();
		
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.pageMaterialPaymentForStatus(paging, filters, MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT, "ne");
		
		MaterialSubOrderPO materialSubOrderPO;
		MaterialPaymentVO materialPaymentVO;
		
		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){
			
			materialPaymentVO = new MaterialPaymentVO();
			
			BeanUtil.copyProperties(materialPaymentPO, materialPaymentVO);

			if(materialPaymentPO.getMaterialReceipt() != null){
				BeanUtil.copyProperties(materialPaymentPO.getMaterialReceipt(), materialPaymentVO);
			}
			
			materialSubOrderPO = materialPaymentPO.getMaterialSubOrder();
			
			materialPaymentVO.setOrderId(materialSubOrderPO.getOrderId());
			materialPaymentVO.setOrderAddr(materialSubOrderPO.getOrderAddr());
			
			materialPaymentVOs.add(materialPaymentVO);
		}
		
		paging.setData(materialPaymentVOs);
	}


	@Override
	public List<MaterialPaymentVO> queryMaterialPaymentByOrderId(MaterialPaymentVO materialPaymentVO) {
		
		String orderId = materialPaymentVO.getOrderId();
		
		List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByOrderId(orderId);
		
		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){
			MaterialPaymentVO _materialPaymentVO = new MaterialPaymentVO();
			
			BeanUtil.copyProperties(materialPaymentPO, _materialPaymentVO);
			BeanUtil.copyProperties(materialPaymentPO.getMaterialReceipt(), materialPaymentVO);
			
			if(materialPaymentPO.getMaterialReceipt() != null){
				BeanUtil.copyProperties(materialPaymentPO.getMaterialReceipt(), _materialPaymentVO);
			}
			
			materialPaymentVOs.add(_materialPaymentVO);
		}
		
		return materialPaymentVOs;
	}

	@Override
	public List<MaterialPaymentVO> queryMaterialPaymentByMsoId(MaterialPaymentVO materialPaymentVO){
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByMsoId(materialPaymentVO.getMsoId(), null);
		List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();
		
		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){
			MaterialPaymentVO _materialPaymentVO = new MaterialPaymentVO();
			BeanUtil.copyProperties(materialPaymentPO, _materialPaymentVO);
			
			if(materialPaymentPO.getMaterialReceipt() != null){
				BeanUtil.copyProperties(materialPaymentPO.getMaterialReceipt(), _materialPaymentVO);
			}
			
			materialPaymentVOs.add(_materialPaymentVO);
		}
		
		return materialPaymentVOs;
	}
	
	@Override
	public float queryMaterialPaymentForCouponByMsoId(MaterialPaymentVO materialPaymentVO){
		
		float coupon = 0;
		
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByMsoId(materialPaymentVO.getMsoId(), null);
		
		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){
			if(materialPaymentPO.getPaymentType() != MaterialPaymentPO.PAYMENTTYPE_TYPE_INIT_INT){
				
				MaterialReceiptPO materialReceiptPO = materialPaymentPO.getMaterialReceipt();
				
				if(materialReceiptPO != null){
					coupon = Arith.add(coupon, materialReceiptPO.getCoupon());
				}
			}
		}
		
		materialPaymentVO.setCoupon(coupon);
		
		return coupon;
	}

	@Override
	public List<MaterialPaymentVO> queryMaterialPaymentForNotInitByMrId(MaterialReceiptVO materialReceiptVO, String userId) {
		
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentForNotInitByMrId(materialReceiptVO.getMrId());
		List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();
		
		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){
			
			MaterialReceiptPO materialReceiptPO = materialPaymentPO.getMaterialReceipt();
			
			if(!userId.equals(materialReceiptPO.getCollectUserId())){
				continue;
			}
			
			MaterialPaymentVO materialPaymentVO = new MaterialPaymentVO();
			BeanUtil.copyProperties(materialPaymentPO, materialPaymentVO);

			if(materialPaymentPO.getMaterialReceipt() != null){
				BeanUtil.copyProperties(materialPaymentPO.getMaterialReceipt(), materialPaymentVO);
			}
			
			materialPaymentVOs.add(materialPaymentVO);
		}
		
		return materialPaymentVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addMaterialPayment(MaterialPaymentVO materialPaymentVO, String userId) throws FLException{
		
		long msoId = materialPaymentVO.getMsoId();
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(msoId);
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		if(materialPaymentVO.getReferMoney() < 0){
			throw new FLException(150025, "款项金额不正确");
		}
		
		if(materialPaymentDao.countMaterialPaymentByMsoIdAType(materialPaymentVO.getMsoId(),materialPaymentVO.getPaymentType()) > 0){
			throw new FLException(150033, "款项类型已存在");
		}
		
		if(materialSubOrderPO.getTotal() == 0 && materialPaymentVO.getPaymentType() == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT){
			throw new FLException(180021, "主材单总金额为0");
		}
		
		MaterialPaymentPO materialPaymentPO = new MaterialPaymentPO();
		BeanUtil.copyProperties(materialPaymentVO, materialPaymentPO);
		
		materialPaymentPO.setMaterialSubOrder(materialSubOrderPO);
		materialPaymentPO.setMaterialType(materialPaymentVO.getMaterialType());
		materialPaymentPO.setMaterialBrand(materialPaymentVO.getMaterialBrand());
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		if(userPO != null){
			materialPaymentPO.setMsoNo("");
			materialPaymentPO.setCreateUserId(userPO.getUserId());
			materialPaymentPO.setCreateUserName(userPO.getCurrentName());
		}
		
		int materialSubOrderPaymentType = materialPaymentPO.getPaymentType();
		
		if(materialSubOrderPaymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT){
			
			if(materialPaymentDao.countMaterialPaymentByMsoIdAType(materialPaymentVO.getMsoId(),MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT)>0){
				throw new FLException(150036, "补款已提交");
			}
			
			materialSubOrderPO.setDepositStatus(MaterialSubOrderPO.FINANCE_STATUS_TYPE_COMMIT_INT);
			materialSubOrderPO.setDepositPayment(materialPaymentPO.getReferMoney());
			
		}else if(materialSubOrderPaymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT){
			
			List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByMsoIdAType(msoId, MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT);
			
			if(materialPaymentPOs.size() == 1){
				MaterialPaymentPO depositPayment = materialPaymentPOs.get(0);
				
				if(depositPayment.getPaymentStatus() == MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT){
					throw new FLException(150029, "款项不可提交");
				}
			}
			
			materialSubOrderPO.setFullStatus(MaterialSubOrderPO.FINANCE_STATUS_TYPE_COMMIT_INT);
			materialSubOrderPO.setFullPayment(materialPaymentPO.getReferMoney());
			
		}else if(materialSubOrderPaymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT){
			
			materialSubOrderPO.setFullStatus(MaterialSubOrderPO.FINANCE_STATUS_TYPE_COMMIT_INT);
			materialSubOrderPO.setFullPayment(-materialPaymentPO.getReferMoney());
			
		}
		
		materialPaymentPO.setMsoNo(materialSubOrderPO.getMsoNo());
		
		materialSubOrderDao.update(materialSubOrderPO);
		
		materialPaymentDao.save(materialPaymentPO); 
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectMaterialPayment(MaterialPaymentVO materialPaymentVO, List<DecorationActivityItemVO> decorationActivityItemVOs, String userId) throws FLException{
		
		MaterialPaymentPO materialPaymentPO = materialPaymentDao.get(materialPaymentVO.getMpId());
		
		if(materialPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}
		
		MaterialReceiptPO materialReceiptPO = new MaterialReceiptPO();
		
		int paymentType = materialPaymentPO.getPaymentType();
		
		if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT || paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT){
			materialReceiptPO.setReceiptType(MaterialReceiptPO.RECEIPT_TYPE_COLLECT_INT);
		}else{
			materialReceiptPO.setReceiptType(MaterialReceiptPO.RECEIPT_TYPE_REFUND_INT);
		}

		if(materialPaymentPO.getPaymentStatus() == MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT){
			
			if(materialPaymentVO.getAdvance() != 0){
				
				int advanceType = materialPaymentVO.getAdvanceType();
				float customerAdvance = 0f;
				String _paymentType = "";
				
				CustomerPO customerPO = customerDao.queryCustomerByCustomerId(materialPaymentPO.getCustomerId());
				
				if(customerPO == null){
					throw new FLException(230001, "客户信息不存在");
				}
				
				AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCustomerId(customerPO.getCustomerId());
				
				if(advancePaymentPO == null){
					throw new FLException(150010, "预付款余额不足");
				}
				
				if(advanceType == MaterialPaymentPO.ADVANCETYPE_TYPE_MATERIAL_INT){
					customerAdvance = advancePaymentPO.getMaterialBalance();
					_paymentType = CustomerPO.BALANCE_TYPE_MATERIAL_STR;
				}else if(advanceType == MaterialPaymentPO.ADVANCETYPE_TYPE_ZATERIAL_INT){
					customerAdvance = advancePaymentPO.getZhenglinBalance();
					_paymentType = CustomerPO.BALANCE_TYPE_ZHENGLIN_STR;
				}
				
				if(customerAdvance < materialPaymentVO.getAdvance()){
					throw new FLException(150010, "预付款余额不足");
				}else{
					
					PaymentVO perPayment = new PaymentVO();
					perPayment.setType(PaymentPO.PAYMENT_TYPE_PAYMENT_STR);
					perPayment.setCash(materialPaymentVO.getAdvance());
					perPayment.setDes(String.format("主材订单号:%s,付款类型:%s", materialPaymentPO.getMsoNo(), paymentType));
					perPayment.setCollectUser(new UserVO(userId));
					perPayment.setCustomer(new CustomerVO(customerPO.getId()));
					perPayment.setPaymentType(_paymentType);
					perPayment.setStatus(PaymentPO.PAYMENT_STATUS_PAID_STR);
					//在预付款历史收款中，存储操作后对应类型的预付款余额
					if(PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_STR.equals(_paymentType)){
						perPayment.setBalance(Arith.sub(advancePaymentPO.getBalance(), materialPaymentVO.getAdvance()));
					}else if(PaymentPO.PAYMENT_PAYMENTTYPE_PROJECT_STR.equals(_paymentType)){
						perPayment.setBalance(Arith.sub(advancePaymentPO.getProjectBalance(), materialPaymentVO.getAdvance()));
					}else if(PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_STR.equals(_paymentType)){
						perPayment.setBalance(Arith.sub(advancePaymentPO.getMaterialBalance(), materialPaymentVO.getAdvance()));
					}else if(PaymentPO.PAYMENT_PAYMENTTYPE_ZATERIAL_STR.equals(_paymentType)){
						perPayment.setBalance(Arith.sub(advancePaymentPO.getZhenglinBalance(), materialPaymentVO.getAdvance()));
					}
					
					MaterialSubOrderPO materialSubOrderPO = materialPaymentPO.getMaterialSubOrder();
					
					if(materialSubOrderPO != null){
						perPayment.setOrderId(materialSubOrderPO.getOrderId());
					}
					
					advancePaymentService.updateAdvancePayment(perPayment);
					
					materialReceiptPO.setAdvance(materialPaymentVO.getAdvance());
					materialReceiptPO.setAdvanceType(materialPaymentVO.getAdvanceType());
				}
			}
			
//			if(materialPaymentVO.getCoupon() != 0 && decorationActivityItemVOs != null && decorationActivityItemVOs.size() > 0){
//				
//				float coupon = 0f;
//				StringBuffer couponInfo = new StringBuffer("#");
//				
//				String _couponInfo = "%s:%d:%d#";
//				
//				for(DecorationActivityItemVO decorationActivityItemVO: decorationActivityItemVOs){
//					DecorationActivityItemPO decorationActivityItemPO = decorationActivityItemDao.get(decorationActivityItemVO.getDaiId());
//					
//					if(decorationActivityItemPO == null){
//						throw new FLException(140030, "订单活动物品不存在");
//					}
//					
//					if(decorationActivityItemPO.getNum() < decorationActivityItemVO.getNum()){
//						throw new FLException(150023, "券数量不足");
//					}
//					
//					decorationActivityItemPO.setNum((int) Arith.sub(decorationActivityItemPO.getNum(), decorationActivityItemVO.getNum()));
//					
//					coupon = Arith.add(coupon, Arith.mul(decorationActivityItemVO.getNum(), decorationActivityItemPO.getMoney()));
//					
//					couponInfo.append(String.format(_couponInfo, decorationActivityItemPO.getActivityItemName(), decorationActivityItemVO.getNum(), decorationActivityItemVO.getDaiId()));
//					
//					decorationActivityItemDao.update(decorationActivityItemPO);
//				}
//				
//				if(materialPaymentVO.getCoupon() != coupon){
//					throw new FLException(150024, "券总金额与券统计金额不等");
//				}
//				
//				materialReceiptPO.setCoupon(coupon);
//				materialReceiptPO.setCouponInfo(couponInfo.toString());
//			}
			
			if(materialPaymentVO.getCoupon() != 0){
				materialReceiptPO.setCoupon(materialPaymentVO.getCoupon());
				materialReceiptPO.setCouponInfo(materialPaymentVO.getCouponInfo());
			}
			
			if(materialPaymentVO.getCash() != 0){
				materialReceiptPO.setCash(materialPaymentVO.getCash());
				materialReceiptPO.setCashInfo(materialPaymentVO.getCashInfo());
			}
			if(materialPaymentVO.getBank() != 0){
				materialReceiptPO.setBank(materialPaymentVO.getBank());
				materialReceiptPO.setBankInfo(materialPaymentVO.getBankInfo());
			}
			if(materialPaymentVO.getCheckv() != 0){
				materialReceiptPO.setCheckv(materialPaymentVO.getCheckv());
				materialReceiptPO.setCheckvBankName(materialPaymentVO.getCheckvBankName());
			}
			if(materialPaymentVO.getInstallment() != 0){
				materialReceiptPO.setInstallment(materialPaymentVO.getInstallment());
				materialReceiptPO.setInstallmentBankName(materialPaymentVO.getInstallmentBankName());
			}
			if(materialPaymentVO.getAccounts() != 0){
				materialReceiptPO.setAccounts(materialPaymentVO.getAccounts());
				materialReceiptPO.setAccountsBankName(materialPaymentVO.getAccountsBankName());
			}
			
			materialReceiptPO.setDes(materialPaymentVO.getDes());
			materialPaymentPO.setPaymentStatus(MaterialPaymentPO.PAYMENTSTATUS_TYPE_COLLECT_INT);
			
			MaterialSubOrderPO materialSubOrderPO = materialPaymentPO.getMaterialSubOrder();
			
			float count = 0;
			
			if(materialSubOrderPO != null){
				
				String materialBrandName = materialSubOrderPO.getMaterialBrand();
				
				if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT){
					materialSubOrderPO.setDepositStatus(MaterialSubOrderPO.FINANCE_STATUS_TYPE_COLLECT_INT);
					
					count = Arith.add(count, materialPaymentPO.getReferMoney());
				}else if(MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT == paymentType){
					materialSubOrderPO.setFullStatus(MaterialSubOrderPO.FINANCE_STATUS_TYPE_COLLECT_INT);
					materialSubOrderPO.setFullCollectTime(materialReceiptPO.getCollectTime());
					
					if(materialBrandName.contains("正林") && !"正林理石".equals(materialBrandName)){ // 正林不针对券进行业绩计算
						count = Arith.add(count, materialPaymentPO.getReferMoney());
					}else{
						count = Arith.add(Arith.add(count, materialPaymentPO.getReferMoney()), materialSubOrderPO.getCoupon());
					}
				}
				
				String notCountMaterialCollectUserId = SystemConfig.getString("notCountMaterialCollectUserId", "");
				String notCountDesignDepartmentId = SystemConfig.getString("notCountDesignDepartmentId", "");
				
				if(materialSubOrderPO.getMsoType() != MaterialSubOrderPO.MSO_TYPE_GIVE_INT && notCountMaterialCollectUserId.indexOf(userId) == -1){ // 类型不为赠送 , 收款不为指定人员计算业绩
				
					String currentTimeStr = DateUtil.current("yyyy-MM-dd");
					
					String salesmanId = materialSubOrderPO.getSalesmanId();
					String salesmanName = materialSubOrderPO.getSalesmanName();
					
					String departmentId = materialSubOrderPO.getDepartmentId();
					String departmentName = materialSubOrderPO.getDepartmentName();
					
					String regionId = materialSubOrderPO.getRegionId();
					String regionName = materialSubOrderPO.getRegionName();
					
					if(notCountDesignDepartmentId.indexOf(departmentId) == -1){
					
						materialReportService.updateMaterialTypeCount(materialSubOrderPO.getMaterialType(), count, currentTimeStr); // 主材品类业绩统计
						materialReportService.updateMaterialBrandCount(materialSubOrderPO.getMaterialBrand(), count, currentTimeStr); // 主材品牌业绩统计
						materialReportService.updateMaterialDepartmentCount(materialSubOrderPO.getMaterialDeptId(), count, currentTimeStr); // 主材部门业绩统计
						
						if(materialSubOrderPO.getDesignerFlag() == MaterialSubOrderPO.DESIGNERFLAG_TYPE_DESIGNER_INT){
							
							if(materialBrandName.contains("正林") && !"正林理石".equals(materialBrandName)){
								materialReportService.updateZaterialDesignerCount(salesmanId,salesmanName, departmentId, departmentName, regionId, regionName, materialBrandName, count, currentTimeStr); // 统计正林设计师业绩
								materialReportService.updateZaterialDesignerDepartmentCount(departmentId, departmentName, regionId, regionName, materialBrandName, count, currentTimeStr); // 统计正林设计部门业绩
								materialReportService.updateZaterialDesignerRegionCount(regionId, regionName, materialBrandName, count, currentTimeStr); // 统计正林设计中心业绩
								
								materialRankService.updateZaterialDesignerRank(salesmanId, salesmanName, count, currentTimeStr);
								materialRankService.updateZaterialDesignerDepartmentRank(departmentId, departmentName, count, currentTimeStr);
								materialRankService.updateZaterialDesignerRegionRank(regionId, regionName, count, currentTimeStr);
							}else{
								materialReportService.updateMaterialDesignerCount(salesmanId,salesmanName, departmentId, departmentName, regionId, regionName, count, currentTimeStr); // 统计主材设计师业绩
								materialReportService.updateMaterialDesignerDepartmentCount(departmentId, departmentName, regionId, regionName, count, currentTimeStr); // 统计主材设计部门业绩
								materialReportService.updateMaterialDesignerRegionCount(regionId, regionName, count, currentTimeStr); // 统计主材设计分区业绩
								
								materialRankService.updateMaterialDesignerRank(salesmanId, salesmanName, count, currentTimeStr);
								materialRankService.updateMaterialDesignerDepartmentRank(departmentId, departmentName, count, currentTimeStr);
								materialRankService.updateMaterialDesignerRegionRank(regionId, regionName, count, currentTimeStr);
							}
						}
					}
				}
				
				materialSubOrderDao.update(materialSubOrderPO);
			}
			
			UserPO userPO = userDao.queryUserByUserId(userId);
			if(userPO != null){
				materialReceiptPO.setCollectUserName(userPO.getCurrentName());
			}
			materialReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
			materialReceiptPO.setCollectUserId(userId);
			
			materialPaymentPO.setMaterialReceipt(materialReceiptPO);
			
			materialReceiptDao.save(materialReceiptPO);
			materialPaymentDao.update(materialPaymentPO);
			
			materialPaymentVO.setMrId(materialReceiptPO.getMrId());
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectMaterialPayments(MaterialSubOrderVO materialSubOrderVO, List<MaterialPaymentVO> materialPaymentVOs, MaterialReceiptVO materialReceiptVO, String userId) throws FLException{
		
		float total = 0;
		
		String notCountMaterialCollectUserId = SystemConfig.getString("notCountMaterialCollectUserId", "");
		String notCountDesignDepartmentId = SystemConfig.getString("notCountDesignDepartmentId", "");
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(materialSubOrderVO.getOrderId());
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		MaterialReceiptPO materialReceiptPO = new MaterialReceiptPO();
		
		Float advance = materialReceiptVO.getAdvance();
		Float cash = materialReceiptVO.getCash();
		Float bank = materialReceiptVO.getBank();
		Float checkv = materialReceiptVO.getCheckv();
		Float installment = materialReceiptVO.getInstallment();
		Float accounts = materialReceiptVO.getAccounts();
		Float coupon = materialReceiptVO.getCoupon();
		
		if(advance != null && advance != 0){
			
			int advanceType = materialReceiptVO.getAdvanceType();
			float customerAdvance = 0f;
			String _paymentType = "";
			
			CustomerPO customerPO = decorationOrderPO.getCustomerPO();
			
			if(customerPO == null){
				throw new FLException(230001, "客户信息不存在");
			}
			
			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCustomerId(customerPO.getCustomerId());
			
			if(advancePaymentPO == null){
				throw new FLException(150010, "预付款余额不足");
			}
			
			if(advanceType == MaterialPaymentPO.ADVANCETYPE_TYPE_MATERIAL_INT){
				customerAdvance = advancePaymentPO.getMaterialBalance();
				_paymentType = CustomerPO.BALANCE_TYPE_MATERIAL_STR;
			}else if(advanceType == MaterialPaymentPO.ADVANCETYPE_TYPE_ZATERIAL_INT){
				customerAdvance = advancePaymentPO.getZhenglinBalance();
				_paymentType = CustomerPO.BALANCE_TYPE_ZHENGLIN_STR;
			}
			
			if(customerAdvance < materialReceiptVO.getAdvance()){
				throw new FLException(150010, "预付款余额不足");
			}else{
				
				PaymentVO paymentVO = new PaymentVO();
				paymentVO.setType(PaymentPO.PAYMENT_TYPE_PAYMENT_STR);
				paymentVO.setCash(materialReceiptVO.getAdvance());
				paymentVO.setDes("主材批量收款");
				paymentVO.setCollectUser(new UserVO(userId));
				paymentVO.setCustomer(new CustomerVO(customerPO.getId()));
				paymentVO.setPaymentType(_paymentType);
				paymentVO.setOrderId(materialSubOrderVO.getOrderId());
				paymentVO.setStatus(PaymentPO.PAYMENT_STATUS_PAID_STR);
				//在预付款历史收款中，存储操作后对应类型的预付款余额
				if(PaymentPO.PAYMENT_PAYMENTTYPE_BALANCE_STR.equals(_paymentType)){
					paymentVO.setBalance(Arith.sub(advancePaymentPO.getBalance(), materialReceiptVO.getAdvance()));
				}else if(PaymentPO.PAYMENT_PAYMENTTYPE_PROJECT_STR.equals(_paymentType)){
					paymentVO.setBalance(Arith.sub(advancePaymentPO.getProjectBalance(), materialReceiptVO.getAdvance()));
				}else if(PaymentPO.PAYMENT_PAYMENTTYPE_MATERIAL_STR.equals(_paymentType)){
					paymentVO.setBalance(Arith.sub(advancePaymentPO.getMaterialBalance(), materialReceiptVO.getAdvance()));
				}else if(PaymentPO.PAYMENT_PAYMENTTYPE_ZATERIAL_STR.equals(_paymentType)){
					paymentVO.setBalance(Arith.sub(advancePaymentPO.getZhenglinBalance(), materialReceiptVO.getAdvance()));
				}
				
				materialReceiptPO.setAdvance(materialReceiptVO.getAdvance());
				materialReceiptPO.setAdvanceType(materialReceiptVO.getAdvanceType());
				
				advancePaymentService.updateAdvancePayment(paymentVO);
			}
		}
		
		if(cash != null && cash != 0){
			materialReceiptPO.setCash(materialReceiptVO.getCash());
			materialReceiptPO.setCashInfo(materialReceiptVO.getCashInfo());
			total = Arith.add(total, materialReceiptVO.getCash());
		}
		if(bank != null && bank != 0){
			materialReceiptPO.setBank(materialReceiptVO.getBank());
			materialReceiptPO.setBankInfo(materialReceiptVO.getBankInfo());
			total = Arith.add(total, materialReceiptVO.getBank());
		}
		if(checkv != null && checkv != 0){
			materialReceiptPO.setCheckv(materialReceiptVO.getCheckv());
			materialReceiptPO.setCheckvBankName(materialReceiptVO.getCheckvBankName());
			total = Arith.add(total, materialReceiptVO.getCheckv());
		}
		if(installment != null && installment != 0){
			materialReceiptPO.setInstallment(materialReceiptVO.getInstallment());
			materialReceiptPO.setInstallmentBankName(materialReceiptVO.getInstallmentBankName());
			total = Arith.add(total, materialReceiptVO.getInstallment());
		}
		if(accounts != null && accounts != 0){
			materialReceiptPO.setAccounts(materialReceiptVO.getAccounts());
			materialReceiptPO.setAccountsBankName(materialReceiptVO.getAccountsBankName());
			total = Arith.add(total, materialReceiptVO.getAccounts());
		}
		if(coupon != null && coupon != 0){
			materialReceiptPO.setCoupon(materialReceiptVO.getCoupon());
			materialReceiptPO.setCouponInfo(materialReceiptVO.getCouponInfo());
			total = Arith.add(total, materialReceiptVO.getCoupon());
		}
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		if(userPO != null){
			materialReceiptPO.setCollectUserName(userPO.getCurrentName());
		}
		materialReceiptPO.setCollectUserId(userId);
		materialReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		materialReceiptPO.setReceiptType(MaterialReceiptPO.RECEIPT_TYPE_COLLECT_INT);
		materialReceiptPO.setDes(materialReceiptVO.getDes());
		
		materialReceiptDao.save(materialReceiptPO);
		
		for(MaterialPaymentVO materialPaymentVO: materialPaymentVOs){
			
			total = 0;
			
			MaterialPaymentPO materialPaymentPO = materialPaymentDao.get(materialPaymentVO.getMpId());
			
			if(materialPaymentPO == null){
				throw new FLException(150003, "款项不存在");
			}
			
			MaterialSubOrderPO materialSubOrderPO = materialPaymentPO.getMaterialSubOrder();
			
			if(materialSubOrderPO == null){
				throw new FLException(180001, "主材订单不存在");
			}
			
			if(materialPaymentPO.getPaymentStatus() != MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT){
				throw new FLException(150021, "主材场外当前状态不能收款");
			}
			
			materialPaymentPO.setPaymentStatus(MaterialPaymentPO.PAYMENTSTATUS_TYPE_COLLECT_INT);
			
			int paymentType = materialPaymentPO.getPaymentType();
			int msoType = materialSubOrderPO.getMsoType();
			
			String materialBrandName = materialSubOrderPO.getMaterialBrand();
			
			float count = 0;
			
			if(materialSubOrderPO != null){
				if(MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT == paymentType){
					materialSubOrderPO.setDepositStatus(MaterialSubOrderPO.FINANCE_STATUS_TYPE_COLLECT_INT);
					
					count = materialPaymentPO.getReferMoney();
				}else if(MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT == paymentType){
					materialSubOrderPO.setFullStatus(MaterialSubOrderPO.FINANCE_STATUS_TYPE_COLLECT_INT);
					materialSubOrderPO.setFullCollectTime(materialReceiptPO.getCollectTime());
					
					if(materialBrandName.contains("正林") && !"正林理石".equals(materialBrandName)){ // 正林不针对券进行业绩计算
						count = Arith.add(count, materialPaymentPO.getReferMoney());
					}else{
						count = Arith.add(Arith.add(count, materialPaymentPO.getReferMoney()), materialSubOrderPO.getCoupon());
					}
				}
				
				materialSubOrderDao.update(materialSubOrderPO);
				
				if(msoType != MaterialSubOrderPO.MSO_TYPE_GIVE_INT && notCountMaterialCollectUserId.indexOf(userId) == -1){ // 类型为赠送 , 收款为指定人员 , 不计算业绩统计
					
					String currentTimeStr = DateUtil.current("yyyy-MM-dd");
					
					String salesmanId = materialSubOrderPO.getSalesmanId();
					String salesmanName = materialSubOrderPO.getSalesmanName();
					
					String departmentId = materialSubOrderPO.getDepartmentId();
					String departmentName = materialSubOrderPO.getDepartmentName();
					
					String regionId = materialSubOrderPO.getRegionId();
					String regionName = materialSubOrderPO.getRegionName();
					
					if(notCountDesignDepartmentId.indexOf(departmentId) == -1){ // 指定部门不参与业绩统计
					
						//--------------------------------------业绩统计-------------------------------
						
						materialReportService.updateMaterialTypeCount(materialSubOrderPO.getMaterialType(), count, currentTimeStr); // 主材品类业绩统计
						materialReportService.updateMaterialBrandCount(materialSubOrderPO.getMaterialBrand(), count, currentTimeStr); // 主材品牌业绩统计
						materialReportService.updateMaterialDepartmentCount(materialSubOrderPO.getMaterialDeptId(), count, currentTimeStr); // 主材部门业绩统计
						
						//--------------------------------------设计中心和部门业绩统计-------------------------------
						if(materialSubOrderPO.getDesignerFlag() == MaterialSubOrderPO.DESIGNERFLAG_TYPE_DESIGNER_INT){
							
							if(materialBrandName.contains("正林") && !"正林理石".equals(materialBrandName)){
								materialReportService.updateZaterialDesignerCount(salesmanId, salesmanName, departmentId, departmentName, regionId, regionName, materialBrandName, count, currentTimeStr); // 统计正林设计师业绩
								materialReportService.updateZaterialDesignerDepartmentCount(departmentId, departmentName, regionId, regionName, materialBrandName, count, currentTimeStr); // 统计正林设计部门业绩
								materialReportService.updateZaterialDesignerRegionCount(regionId, regionName, materialBrandName, count, currentTimeStr); // 统计正林设计中心业绩
								
								materialRankService.updateZaterialDesignerRank(salesmanId, salesmanName, count, currentTimeStr);
								materialRankService.updateZaterialDesignerDepartmentRank(departmentId, departmentName, count, currentTimeStr);
								materialRankService.updateZaterialDesignerRegionRank(regionId, regionName, count, currentTimeStr);
							}else{
								materialReportService.updateMaterialDesignerCount(salesmanId, salesmanName, departmentId, departmentName, regionId, regionName, count, currentTimeStr); // 统计主材设计师业绩
								materialReportService.updateMaterialDesignerDepartmentCount(departmentId, departmentName, regionId, regionName, count, currentTimeStr); // 统计主材设计部门业绩
								materialReportService.updateMaterialDesignerRegionCount(regionId, regionName, count, currentTimeStr); // 统计主材设计分区业绩
								
								materialRankService.updateMaterialDesignerRank(salesmanId, salesmanName, count, currentTimeStr);
								materialRankService.updateMaterialDesignerDepartmentRank(departmentId, departmentName, count, currentTimeStr);
								materialRankService.updateMaterialDesignerRegionRank(regionId, regionName, count, currentTimeStr);
							}
						}
					}
				}
			}
			
			materialPaymentPO.setMaterialReceipt(materialReceiptPO);
			
			materialPaymentDao.update(materialPaymentPO);
			
			materialReceiptVO.setMrId(materialReceiptPO.getMrId());
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectMaterialPaymentForRefund(MaterialPaymentVO materialPaymentVO, String userId) throws FLException{
		
		float real = 0;
		float count = 0;
		
		MaterialPaymentPO materialPaymentPO = materialPaymentDao.get(materialPaymentVO.getMpId());
		
		if(materialPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}
		
		MaterialReceiptPO materialReceiptPO = new MaterialReceiptPO();
		
		MaterialSubOrderPO materialSubOrderPO = materialPaymentPO.getMaterialSubOrder();
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		Float cash = materialPaymentVO.getCash();
		Float bank = materialPaymentVO.getBank();
		Float coupon = materialPaymentVO.getCoupon();
		
		int msoType = materialSubOrderPO.getMsoType();
		
		String materialBrandName = materialSubOrderPO.getMaterialBrand();
		
		int paymentType = materialPaymentPO.getPaymentType() ;
		
		if(cash != null && cash != 0f){
			materialReceiptPO.setCash(materialPaymentVO.getCash());
			materialReceiptPO.setCashInfo(materialPaymentVO.getCashInfo());
			
			real = Arith.add(real, cash);
		}
		if(bank != null && bank != 0f){
			materialReceiptPO.setBank(bank);
			materialReceiptPO.setBankInfo(materialPaymentVO.getBankInfo());
			
			real = Arith.add(real, bank);
		}
		if(coupon != null && coupon != 0f){
			materialReceiptPO.setCoupon(coupon);
			materialReceiptPO.setCouponInfo(materialPaymentVO.getCouponInfo());
			
			real = Arith.add(real, coupon);
		}
		
		materialPaymentPO.setPaymentStatus(MaterialPaymentPO.PAYMENTSTATUS_TYPE_COLLECT_INT);
		
		if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT || paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_REFUND_INT){
			
			if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT){
				materialSubOrderPO.setFullStatus(MaterialSubOrderPO.FINANCE_STATUS_TYPE_COLLECT_INT);
				materialSubOrderPO.setFullCollectTime(materialReceiptPO.getCollectTime());
				
				materialSubOrderDao.update(materialSubOrderPO);
			}
			
			if(materialBrandName.contains("正林") && !"正林理石".equals(materialBrandName)){ // 正林不针对券进行业绩计算
				count = Arith.sub(count, materialPaymentPO.getReferMoney());
			}else{
				count = Arith.add(Arith.sub(count, materialPaymentPO.getReferMoney()), materialSubOrderPO.getCoupon());
			}
		}else if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_REJECT_INT){
			List<MaterialSubOrderRefundPO> materialSubOrderRefundPOs = materialSubOrderRefundDao.queryMaterialSubOrderRefundByMpId(materialPaymentPO.getMpId());
			
			for(MaterialSubOrderRefundPO materialSubOrderRefundPO: materialSubOrderRefundPOs){
				materialSubOrderRefundPO.setStatus(MaterialSubOrderRefundPO.STATUS_TYPE_PAYMENTCOLLECT_INT);
				
				materialSubOrderRefundDao.update(materialSubOrderRefundPO);
			}
			
			count = Arith.sub(count, materialPaymentPO.getReferMoney());
		}else if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_COUPON_REFUND_INT){
			if(materialBrandName.contains("正林") && !"正林理石".equals(materialBrandName)){ // 正林不针对券进行业绩计算
				count = Arith.sub(count, materialPaymentPO.getReferMoney());
			}
		}
		
		String notCountMaterialCollectUserId = SystemConfig.getString("notCountMaterialCollectUserId", "");
		String notCountDesignDepartmentId = SystemConfig.getString("notCountDesignDepartmentId", "");
		
		if(msoType != MaterialSubOrderPO.MSO_TYPE_GIVE_INT && notCountMaterialCollectUserId.indexOf(userId) == -1){ // 类型为赠送不计算业绩统计
			
			String currentTimeStr = DateUtil.current("yyyy-MM-dd");
			
			String salesmanId = materialSubOrderPO.getSalesmanId();
			String salesmanName = materialSubOrderPO.getSalesmanName();
			
			String departmentId = materialSubOrderPO.getDepartmentId();
			String departmentName = materialSubOrderPO.getDepartmentName();
			
			String regionId = materialSubOrderPO.getRegionId();
			String regionName = materialSubOrderPO.getRegionName();
			
			//--------------------------------------业绩统计-------------------------------
			
			if(notCountDesignDepartmentId.indexOf(departmentId) == -1){ // 指定部门不参与业绩统计
			
				materialReportService.updateMaterialTypeCount(materialSubOrderPO.getMaterialType(), count, currentTimeStr); // 主材品类业绩统计
				materialReportService.updateMaterialBrandCount(materialSubOrderPO.getMaterialBrand(), count, currentTimeStr); // 主材品牌业绩统计
				materialReportService.updateMaterialDepartmentCount(materialSubOrderPO.getMaterialDeptId(), count, currentTimeStr); // 主材部门业绩统计
				
				//--------------------------------------设计中心和部门业绩统计-------------------------------
				if(materialSubOrderPO.getDesignerFlag() == MaterialSubOrderPO.DESIGNERFLAG_TYPE_DESIGNER_INT){
					
					if(materialBrandName.contains("正林") && !"正林木门".equals(materialBrandName)){
						materialReportService.updateZaterialDesignerCount(salesmanId, salesmanName, departmentId, departmentName, regionId, regionName, materialBrandName, count, currentTimeStr); // 统计正林设计师业绩
						materialReportService.updateZaterialDesignerDepartmentCount(departmentId, departmentName, regionId, regionName, materialBrandName, count, currentTimeStr); // 统计正林设计部门业绩
						materialReportService.updateZaterialDesignerRegionCount(regionId, regionName, materialBrandName, count, currentTimeStr); // 统计正林设计中心业绩
						
						materialRankService.updateZaterialDesignerRank(salesmanId, salesmanName, count, currentTimeStr);
						materialRankService.updateZaterialDesignerDepartmentRank(departmentId, departmentName, count, currentTimeStr);
						materialRankService.updateZaterialDesignerRegionRank(regionId, regionName, count, currentTimeStr);
					}else{
						materialReportService.updateMaterialDesignerCount(salesmanId, salesmanName, departmentId, departmentName, regionId, regionName, count, currentTimeStr); // 统计主材设计师业绩
						materialReportService.updateMaterialDesignerDepartmentCount(departmentId, departmentName, regionId, regionName, count, currentTimeStr); // 统计主材设计部门业绩
						materialReportService.updateMaterialDesignerRegionCount(regionId, regionName, count, currentTimeStr); // 统计主材设计分区业绩
						
						materialRankService.updateMaterialDesignerRank(salesmanId, salesmanName, count, currentTimeStr);
						materialRankService.updateMaterialDesignerDepartmentRank(departmentId, departmentName, count, currentTimeStr);
						materialRankService.updateMaterialDesignerRegionRank(regionId, regionName, count, currentTimeStr);
					}
				}
			}
		}
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		if(userPO != null){
			materialReceiptPO.setCollectUserName(userPO.getCurrentName());
		}
		materialReceiptPO.setCollectUserId(userId);
		materialReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		materialReceiptPO.setReceiptType(MaterialReceiptPO.RECEIPT_TYPE_REFUND_INT);
		materialReceiptPO.setDes(materialPaymentVO.getDes());
		materialReceiptPO.setRealMoney(real);
		materialPaymentPO.setMaterialReceipt(materialReceiptPO);
		
		materialReceiptDao.save(materialReceiptPO);
		materialPaymentDao.update(materialPaymentPO);
		
		materialPaymentVO.setMrId(materialReceiptPO.getMrId());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateMaterialPayment(MaterialPaymentVO materialPaymentVO, String userId) throws FLException{
		
		MaterialPaymentPO materialPaymentPO = materialPaymentDao.get(materialPaymentVO.getMpId());
		
		if(materialPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}
		
		MaterialReceiptPO materialReceiptPO = materialPaymentPO.getMaterialReceipt();
		
		if(materialPaymentPO != null && materialPaymentPO.getPaymentStatus() == MaterialPaymentPO.PAYMENTSTATUS_TYPE_COLLECT_INT){
			
			if(!materialReceiptPO.getCollectUserId().equals(userId)){
				throw new FLException(150014, "收款人不匹配");
			}
			
			if(materialPaymentVO.getCash() != 0){
				materialReceiptPO.setCash(materialPaymentVO.getCash());
				materialReceiptPO.setCashInfo(materialPaymentVO.getCashInfo());
			}else{
				materialReceiptPO.setCash(0);
				materialReceiptPO.setCashInfo("");
			}
			if(materialPaymentVO.getBank() != 0){
				materialReceiptPO.setBank(materialPaymentVO.getBank());
				materialReceiptPO.setBankInfo(materialPaymentVO.getBankInfo());
			}else{
				materialReceiptPO.setBank(0);
				materialReceiptPO.setBankInfo("");
			}
			if(materialPaymentVO.getCheckv() != 0){
				materialReceiptPO.setCheckv(materialPaymentVO.getCheckv());
				materialReceiptPO.setCheckvBankName(materialPaymentVO.getCheckvBankName());
			}else{
				materialReceiptPO.setCheckv(0);
				materialReceiptPO.setCheckvBankName("");
			}
			if(materialPaymentVO.getInstallment() != 0){
				materialReceiptPO.setInstallment(materialPaymentVO.getInstallment());
				materialReceiptPO.setInstallmentBankName(materialPaymentVO.getInstallmentBankName());
			}else{
				materialReceiptPO.setInstallment(0);
				materialReceiptPO.setInstallmentBankName("");
			}
			if(materialPaymentVO.getAccounts() != 0){
				materialReceiptPO.setAccounts(materialPaymentVO.getAccounts());
				materialReceiptPO.setAccountsBankName(materialPaymentVO.getAccountsBankName());
			}else{
				materialReceiptPO.setAccounts(0);
				materialReceiptPO.setAccountsBankName("");
			}
			if(materialPaymentVO.getCoupon() != 0){
				materialReceiptPO.setCoupon(materialPaymentVO.getCoupon());
				materialReceiptPO.setCouponInfo(materialPaymentVO.getCouponInfo());
			}else{
				materialReceiptPO.setCoupon(0);
				materialReceiptPO.setCouponInfo("");
			}
			
			materialReceiptPO.setDes(materialPaymentVO.getDes());
			
			materialReceiptDao.update(materialReceiptPO);
			materialPaymentDao.update(materialPaymentPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void confirmMaterialPayment(List<Long> mpIds, String userId) throws FLException{

		for(Long mpId: mpIds){
			MaterialPaymentPO materialPaymentPO = materialPaymentDao.get(mpId);

			if(materialPaymentPO == null){
				throw new FLException(150003, "款项不存在");
			}

			MaterialReceiptPO materialReceiptPO = materialPaymentPO.getMaterialReceipt();

			MaterialSubOrderPO materialSubOrderPO = materialPaymentPO.getMaterialSubOrder();

			if(materialSubOrderPO == null){
				throw new FLException(180001, "主材订单不存在");
			}

			if(materialPaymentPO.getPaymentStatus() == MaterialPaymentPO.PAYMENTSTATUS_TYPE_COLLECT_INT){
				if(materialPaymentPO.getPaymentType() == MaterialPaymentPO.PAYMENTTYPE_TYPE_REJECT_INT){

					List<MaterialSubOrderRefundPO> materialSubOrderRefundPOs = materialSubOrderRefundDao.queryMaterialSubOrderRefundByMpId(materialPaymentPO.getMpId());

					for(MaterialSubOrderRefundPO materialSubOrderRefundPO: materialSubOrderRefundPOs){
						materialSubOrderRefundPO.setStatus(MaterialSubOrderRefundPO.STATUS_TYPE_PAYMENTCONFIRM_INT);
						materialSubOrderRefundDao.update(materialSubOrderRefundPO);
					}
				}else{

					int materialPaymentType = materialPaymentPO.getPaymentType();

					if(materialSubOrderPO != null){
						if(materialPaymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT){
							materialSubOrderPO.setDepositStatus(MaterialSubOrderPO.FINANCE_STATUS_TYPE_CONFIRM_INT);
						}else if(materialPaymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT || materialPaymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT){
							materialSubOrderPO.setFullStatus(MaterialSubOrderPO.FINANCE_STATUS_TYPE_CONFIRM_INT);
						}

						materialSubOrderDao.update(materialSubOrderPO);
					}
				}

				UserPO userPO = userDao.queryUserByUserId(userId);
				materialReceiptPO.setConfirmUserId(userId);
				materialReceiptPO.setConfirmUserName(userPO.getUserName());
				materialReceiptPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));
				materialPaymentPO.setPaymentStatus(MaterialPaymentPO.PAYMENTSTATUS_TYPE_CONFIRM_INT);

				if(materialReceiptPO.getStatus() != MaterialPaymentPO.PAYMENTSTATUS_TYPE_CONFIRM_INT){
					materialReceiptPO.setStatus((short) MaterialPaymentPO.PAYMENTSTATUS_TYPE_CONFIRM_INT);
				}

				materialReceiptDao.update(materialReceiptPO);
				materialPaymentDao.update(materialPaymentPO);
			}
		}
	}


	@Override
	@Transactional(rollbackFor=Exception.class)
	public int cancelMaterialPayment(MaterialPaymentVO materialPaymentVO) throws FLException{
		
		long msoId = materialPaymentVO.getMsoId();
		int paymentType = materialPaymentVO.getPaymentType();
		
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByMsoIdATypeAStatus(msoId, paymentType, MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT);
		
		int materialPaymentLength = materialPaymentPOs.size();
		
		if(materialPaymentLength == 1){
			MaterialPaymentPO materialPaymentPO = materialPaymentPOs.get(0);
			
			MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(materialPaymentVO.getMsoId());
			
			if(materialPaymentPO != null){
				if(materialPaymentPO.getPaymentStatus() == MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT){
					materialPaymentDao.delete(materialPaymentPO);
					
					int depositStatus = materialSubOrderPO.getDepositStatus();
					int fullStatus = materialSubOrderPO.getFullStatus();
					
					if(materialSubOrderPO != null){
						if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT && depositStatus == MaterialSubOrderPO.FINANCE_STATUS_TYPE_COMMIT_INT){
							materialSubOrderPO.setDepositPayment(0);
							materialSubOrderPO.setDepositStatus(MaterialSubOrderPO.FINANCE_STATUS_TYPE_INIT_INT);
						}else if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT || paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT){
							if(fullStatus == MaterialSubOrderPO.FINANCE_STATUS_TYPE_COMMIT_INT){
								materialSubOrderPO.setFullPayment(0);
								materialSubOrderPO.setFullStatus(MaterialSubOrderPO.FINANCE_STATUS_TYPE_INIT_INT);
							}
						}
						
						materialSubOrderDao.update(materialSubOrderPO);
					}
					
					materialPaymentVO.setPaymentStatus(MaterialSubOrderPO.FINANCE_STATUS_TYPE_INIT_INT);
					
					return 0;
				}
			}
		}
		
		throw new FLException(150019, "款项不能撤销");
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void refundMaterialPayment(MaterialPaymentVO materialPaymentVO, String userId) throws FLException{
		
		long msoId = materialPaymentVO.getMsoId();
		int paymentType = materialPaymentVO.getPaymentType();
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(msoId);
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		MaterialPaymentPO materialPaymentPO = new MaterialPaymentPO();
		
		materialPaymentPO.setMaterialSubOrder(materialSubOrderPO);
		materialPaymentPO.setMsoNo(materialSubOrderPO.getMsoNo());
		materialPaymentPO.setCustomerId(materialSubOrderPO.getCustomerId());
		materialPaymentPO.setCustomerName(materialSubOrderPO.getCustomerName());
		
		if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT){
			
			MaterialPaymentPO materialPayment = materialPaymentDao.queryMaterialPaymentByMsoNoAType(materialSubOrderPO.getMsoNo(), paymentType);
			
			if( materialPayment.getPaymentStatus() != MaterialPaymentPO.PAYMENTSTATUS_TYPE_CONFIRM_INT){
				throw new FLException(150005 , "款项状态非已确认,不能退款");
			}
			
			materialPaymentPO.setReferMoney(materialSubOrderPO.getDepositPayment());
			
			materialSubOrderPO.setDepositStatus(MaterialSubOrderPO.FINANCE_STATUS_TYPE_INIT_INT);
			materialSubOrderPO.setDepositPayment(0);
			materialSubOrderPO.setStatus(MaterialSubOrderPO.STATUS_TYPE_WASTE_INT);
			
			materialPaymentPO.setPaymentType(MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_REFUND_INT);
		}else if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT){
			materialPaymentPO.setReferMoney(materialSubOrderPO.getFullPayment());
			
			materialSubOrderPO.setFullStatus(MaterialSubOrderPO.FINANCE_STATUS_TYPE_INIT_INT);
			materialSubOrderPO.setFullPayment(0);
			
			materialPaymentPO.setPaymentType(MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT);
		}
		
		materialPaymentPO.setPaymentStatus(MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT);
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		if(userPO != null){
			materialPaymentPO.setCreateUserId(userPO.getUserId());
			materialPaymentPO.setCreateUserName(userPO.getCurrentName());
		}else{
			materialPaymentPO.setCreateUserId("");
			materialPaymentPO.setCreateUserName("");
		}
		
		materialPaymentPO.setMaterialType(materialSubOrderPO.getMaterialType());
		materialPaymentPO.setMaterialBrand(materialSubOrderPO.getMaterialBrand());
		
		materialPaymentDao.save(materialPaymentPO);
		
		materialSubOrderDao.update(materialSubOrderPO);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refundMaterialPaymentForCoupon(MaterialSubOrderVO materialSubOrderVO, String userId, String userName) throws FLException{
		
		long msoId = materialSubOrderVO.getMsoId();
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(materialSubOrderVO.getMsoId());
		
		if(materialSubOrderPO != null){
			
			materialSubOrderPO.setCoupon(materialSubOrderVO.getCoupon());
			materialSubOrderPO.setCouponInfo(materialSubOrderVO.getCouponInfo());
			
			materialSubOrderDao.update(materialSubOrderPO);
			
			List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByMsoIdAType(msoId, MaterialPaymentPO.PAYMENTTYPE_TYPE_COUPON_REFUND_INT);
			
			if(materialPaymentPOs.size() > 0){
				throw new FLException(150011, "主材退券款项已经存在");
			}
			
			MaterialPaymentPO materialPaymentPO = new MaterialPaymentPO();
			
			materialPaymentPO.setMaterialSubOrder(materialSubOrderPO);
			materialPaymentPO.setReferMoney(materialSubOrderVO.getCoupon());
			materialPaymentPO.setPaymentType(MaterialPaymentPO.PAYMENTTYPE_TYPE_COUPON_REFUND_INT);
			
			materialPaymentPO.setCustomerId(materialSubOrderPO.getCustomerId());
			materialPaymentPO.setCustomerName(materialSubOrderPO.getCustomerName());
			
			materialPaymentPO.setMaterialType(materialSubOrderPO.getMaterialType());
			materialPaymentPO.setMaterialBrand(materialSubOrderPO.getMaterialBrand());
			
			materialPaymentPO.setMsoNo("");
			materialPaymentPO.setCreateUserId(userId);
			materialPaymentPO.setCreateUserName(userName);
			
			materialPaymentPO.setMsoNo(materialSubOrderPO.getMsoNo());
			
			materialPaymentDao.save(materialPaymentPO);
		}
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int changeMaterialPaymentForTime(MaterialPaymentVO materialPaymentVO, Timestamp dateTime, String userId) throws FLException{
		
		Timestamp oldDateTime = null;
		Timestamp oldConfirmTime = null;
		String paymentType = "";
		
		String msoNo = materialPaymentVO.getMsoNo();
		int _paymentType = materialPaymentVO.getPaymentType();
		
		MaterialPaymentPO materialPaymentPO = materialPaymentDao.queryMaterialPaymentByMsoNoAType(msoNo, _paymentType);
		
		if(materialPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}
		
		MaterialReceiptPO materialReceiptPO = materialPaymentPO.getMaterialReceipt();
		
		if(materialPaymentPO != null && (materialPaymentPO.getPaymentStatus() == 1 || materialPaymentPO.getPaymentStatus() == 2)){
			oldDateTime = materialReceiptPO.getCollectTime();
			
			materialReceiptPO.setCollectTime(dateTime);
			
			if(_paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT){
				paymentType = MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_STR;
			}else if(_paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT){
				paymentType = MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_STR;
			}else if(_paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_REJECT_INT){
				paymentType = MaterialPaymentPO.PAYMENTTYPE_TYPE_REJECT_STR;
			}else if(_paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT){
				paymentType = MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_STR;
			}else if(_paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_COUPON_REFUND_INT){
				paymentType = MaterialPaymentPO.PAYMENTTYPE_TYPE_COUPON_REFUND_STR;
			}else if(_paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_REFUND_INT){
				paymentType = MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_REFUND_STR;
			}
			
			if(materialReceiptPO.getConfirmTime() != null && materialReceiptPO.getConfirmTime().before(dateTime)){
				oldConfirmTime = materialReceiptPO.getConfirmTime();
				
				materialReceiptPO.setConfirmTime(dateTime);
			}
			
			materialPaymentDao.update(materialPaymentPO);
			
			ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
			serviceRecordPO.setType(ServiceRecordPO.TYPE_TYPE_CHANGE_MATERIALPAYMENT_TIME_INT);
			serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			serviceRecordPO.setOperateUserId(userId);
			
			if(oldConfirmTime != null){
				serviceRecordPO.setInfo(String.format("主材子订单编号:%s,修改款项类型:%s,原收款时间:%s,修改时间为:%s,原确认时间:", msoNo, paymentType, oldDateTime.toString(), dateTime, oldConfirmTime.toString()));
			}else{
				serviceRecordPO.setInfo(String.format("主材子订单编号:%s,修改款项类型:%s,原收款时间:%s,修改时间为:%s", msoNo, paymentType, oldDateTime.toString(), dateTime));
			}
			
			serviceRecordDao.saveOrUpdate(serviceRecordPO);
		}
		
		return 0;
	}
}
