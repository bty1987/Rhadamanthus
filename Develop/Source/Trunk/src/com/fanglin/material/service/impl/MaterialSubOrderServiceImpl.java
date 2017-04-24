/**
 * @File Name		: MaterialSubOrderServiceImpl.java
 * @Package   	: com.fanglin.service.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.ServiceRecordDao;
import com.fanglin.common.po.ServiceRecordPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.material.dao.MaterialSubOrderBalanceDao;
import com.fanglin.material.dao.MaterialSubOrderDao;
import com.fanglin.material.dao.MaterialSubOrderItemDao;
import com.fanglin.material.po.MaterialSubOrderBalancePO;
import com.fanglin.material.po.MaterialSubOrderItemPO;
import com.fanglin.material.po.MaterialSubOrderPO;
import com.fanglin.material.service.MaterialSubOrderService;
import com.fanglin.material.vo.MaterialSubOrderItemVO;
import com.fanglin.material.vo.MaterialSubOrderVO;
import com.fanglin.payment.dao.MaterialPaymentDao;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("materialSubOrderService")
@Transactional(readOnly=true)
public class MaterialSubOrderServiceImpl implements MaterialSubOrderService {
	
	public static final String CURRENT_TIME_FORMAT_STR = "yyyy-MM-dd";
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private MaterialSubOrderDao materialSubOrderDao;
	
	@Autowired
	private MaterialSubOrderItemDao materialSubOrderItemDao;
	
	@Autowired
	private MaterialPaymentDao materialPaymentDao;
	
	@Autowired
	private MaterialSubOrderBalanceDao materialSubOrderBalanceDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private ServiceRecordDao serviceRecordDao;
	
	@Override
	public void pageMaterialSubOrder(Paging paging, List<Filter> filters){
		
		List<MaterialSubOrderPO> materialSubOrderPOs = materialSubOrderDao.pageMaterialSubOrder(paging, filters);
		List<MaterialSubOrderVO> materialSubOrderVOs = new ArrayList<MaterialSubOrderVO>();
		
		for(MaterialSubOrderPO materialSubOrderPO: materialSubOrderPOs){
			MaterialSubOrderVO materialSubOrderVO = new MaterialSubOrderVO();
			BeanUtil.copyProperties(materialSubOrderPO, materialSubOrderVO);
			materialSubOrderVOs.add(materialSubOrderVO);
		}
		
		paging.setData(materialSubOrderVOs);
	}
	
	@Override
	public void pageMaterialSubOrderByUserId(Paging paging, List<Filter> filters, String orderId, String userId){
		
		UserPO userPO = userDao.get(userId);
		
		if("驻店导购".equals(userPO.getDuty())){
			pageMaterialSubOrderByOrderIdInstoreId(paging, filters, orderId, userId);
		}else{
			pageMaterialSubOrderByOrderId(paging, filters, orderId);
		}
	}

	@Override
	public void pageMaterialSubOrderByOrderId(Paging paging, List<Filter> filters, String orderId){
		
		List<MaterialSubOrderPO> materialSubOrderPOs = materialSubOrderDao.pageMaterialSubOrderByOrderId(paging, filters, orderId);
		List<MaterialSubOrderVO> materialSubOrderVOs = new ArrayList<MaterialSubOrderVO>();
		
		for(MaterialSubOrderPO materialSubOrderPO: materialSubOrderPOs){
			MaterialSubOrderVO materialSubOrderVO = new MaterialSubOrderVO();
			BeanUtil.copyProperties(materialSubOrderPO, materialSubOrderVO);
			materialSubOrderVOs.add(materialSubOrderVO);
		}
		
		paging.setData(materialSubOrderVOs);
	}
	
	@Override
	public void pageMaterialSubOrderByOrderIdADeptId(Paging paging, List<Filter> filters, String orderId, String userId){
		
		UserPO userPO = userDao.get(userId);
		if(userPO != null){
			filters.add(new Filter(MaterialSubOrderPO.COLUMN_MATERIALDEPTID_STR, userPO.getDept().getDeptId(), "eq"));
		}
		
		List<MaterialSubOrderPO> materialSubOrderPOs = materialSubOrderDao.pageMaterialSubOrderByOrderId(paging, filters, orderId);
		List<MaterialSubOrderVO> materialSubOrderVOs = new ArrayList<MaterialSubOrderVO>();
		
		for(MaterialSubOrderPO materialSubOrderPO: materialSubOrderPOs){
			MaterialSubOrderVO materialSubOrderVO = new MaterialSubOrderVO();
			BeanUtil.copyProperties(materialSubOrderPO, materialSubOrderVO);
			materialSubOrderVOs.add(materialSubOrderVO);
		}
		
		paging.setData(materialSubOrderVOs);
	}

	@Override
	public void pageMaterialSubOrderByOrderIdInstoreId(Paging paging, List<Filter> filters, String orderId, String userId){
		
		filters.add(new Filter(MaterialSubOrderPO.COLUMN_INSTOREID_STR, userId, "eq"));
		
		List<MaterialSubOrderPO> materialSubOrderPOs = materialSubOrderDao.pageMaterialSubOrderByOrderId(paging, filters, orderId);
		List<MaterialSubOrderVO> materialSubOrderVOs = new ArrayList<MaterialSubOrderVO>();
		
		for(MaterialSubOrderPO materialSubOrderPO: materialSubOrderPOs){
			MaterialSubOrderVO materialSubOrderVO = new MaterialSubOrderVO();
			BeanUtil.copyProperties(materialSubOrderPO, materialSubOrderVO);
			materialSubOrderVOs.add(materialSubOrderVO);
		}
		
		paging.setData(materialSubOrderVOs);
	}

	@Override
	public void pageMaterialSubOrderForPreBalance(Paging paging, List<Filter> filters, String userId){
		
		List<MaterialSubOrderPO> materialSubOrderPOs = materialSubOrderDao.pageMaterialSubOrderPreBalance(paging, filters);
		List<MaterialSubOrderVO> materialSubOrderVOs = new ArrayList<MaterialSubOrderVO>();
		
		for(MaterialSubOrderPO materialSubOrderPO: materialSubOrderPOs){
			MaterialSubOrderVO materialSubOrderVO = new MaterialSubOrderVO();
			BeanUtil.copyProperties(materialSubOrderPO, materialSubOrderVO);
			
			materialSubOrderVOs.add(materialSubOrderVO);
		}
		
		paging.setData(materialSubOrderVOs);
	}

	@Override
	public void pageMaterialSubOrderForPostBalance(Paging paging, List<Filter> filters){

		List<MaterialSubOrderPO> materialSubOrderPOs = materialSubOrderDao.pageMaterialSubOrderPostBalance(paging, filters);
		List<MaterialSubOrderVO> materialSubOrderVOs = new ArrayList<MaterialSubOrderVO>();
		
		for(MaterialSubOrderPO materialSubOrderPO: materialSubOrderPOs){
			MaterialSubOrderVO materialSubOrderVO = new MaterialSubOrderVO();
			BeanUtil.copyProperties(materialSubOrderPO, materialSubOrderVO);
			materialSubOrderVOs.add(materialSubOrderVO);
		}
		
		paging.setData(materialSubOrderVOs);
	}

	@Override
	public MaterialSubOrderVO queryMaterialSubOrderByMsoId(MaterialSubOrderVO materialSubOrderVO){
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(materialSubOrderVO.getMsoId());
		
		BeanUtil.copyProperties(materialSubOrderPO, materialSubOrderVO);
		
		return materialSubOrderVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addMaterialSubOrder(MaterialSubOrderVO materialSubOrderVO, List<MaterialSubOrderItemVO> materialSubOrderItemVOs, String userId) throws FLException{

		float total = 0;
		StringBuffer msoNo = null;
		Map<String, List<MaterialSubOrderItemPO>> packageItems = new HashMap<String, List<MaterialSubOrderItemPO>>();
		
		MaterialSubOrderPO materialSubOrderPO = new MaterialSubOrderPO();
		BeanUtil.copyProperties(materialSubOrderVO, materialSubOrderPO);
		
		String currentData = DateUtil.current(MaterialSubOrderPO.CURRENT_TIME_FORMAT_STR);
		
		while(true){
			msoNo = new StringBuffer("M");
			msoNo.append(currentData.replace("-", "").substring(2));
			
			int random = new Random().nextInt(9999);
			if(random < 1000){
				random += 1000;
			}
			
			msoNo.append(random);
			
			if(materialSubOrderDao.queryMaterialSubOrderByMsoNo(msoNo.toString()) == null){
				break;
			}
		}
		materialSubOrderPO.setMsoNo(msoNo.toString());
		
		UserPO userPO = userDao.get(materialSubOrderVO.getSalesmanId());
		
		if(userPO != null){
			materialSubOrderPO.setSalesmanName(userPO.getCurrentName());
			if(userPO.getDuty().contains("设计师")){
				materialSubOrderPO.setDesignerFlag(MaterialSubOrderPO.DESIGNERFLAG_TYPE_DESIGNER_INT);
			}else if(userPO.getDuty().contains("业务员")){
				materialSubOrderPO.setDesignerFlag(MaterialSubOrderPO.DESIGNERFLAG_TYPE_SALESMAN_INT);
			}
			if(userPO.getDept().getFatherDept() != null){
				materialSubOrderPO.setRegionId(userPO.getDept().getFatherDept().getDeptId());
				materialSubOrderPO.setRegionName(userPO.getDept().getFatherDept().getDeptName());
			}else{
				materialSubOrderPO.setRegionId("");
				materialSubOrderPO.setRegionName("");
			}
			
			materialSubOrderPO.setDepartmentId(userPO.getDept().getDeptId());
			materialSubOrderPO.setDepartmentName(userPO.getDept().getDeptName());
		}else{
			throw new FLException(180005, "业务人员信息获取失败");
		}
		
		UserPO materialUserPO = userDao.get(materialSubOrderVO.getMaterialerId());
		if(materialUserPO != null){
			materialSubOrderPO.setMaterialerId(materialUserPO.getUserId());
			materialSubOrderPO.setMaterialerName(materialUserPO.getCurrentName());
			materialSubOrderPO.setMaterialDeptId(materialUserPO.getDept().getDeptId());
			materialSubOrderPO.setMaterialDeptName(materialUserPO.getDept().getDeptName());
		}else{
			materialSubOrderPO.setMaterialerId("");
			materialSubOrderPO.setMaterialerName("");
			materialSubOrderPO.setMaterialDeptId("");
			materialSubOrderPO.setMaterialDeptName("");
		}
		
		if(materialSubOrderVO.getInstoreId() == null || "".equals(materialSubOrderVO.getInstoreId())){
			materialSubOrderPO.setInstoreId("");
			materialSubOrderPO.setInstoreName("");
		}else{
			UserPO instorer = userDao.get(materialSubOrderVO.getInstoreId());
			if(instorer != null){
				materialSubOrderPO.setInstoreId(instorer.getUserId());
				materialSubOrderPO.setInstoreName(instorer.getCurrentName());
			}
		}
		
		Timestamp cuttentTimestamp = DateUtil.getDateToTimestamp(new Date());
		
		materialSubOrderPO.setCreateTime(cuttentTimestamp);
		materialSubOrderPO.setPreBalanceTime(cuttentTimestamp);
		materialSubOrderPO.setPostBalanceTime(cuttentTimestamp);
		materialSubOrderPO.setCouponInfo("");
		materialSubOrderPO.setDeliveryUserId("");
		
		if((materialSubOrderPO.getOtherStatus() & MaterialSubOrderPO.OTHER_STATUS_MEND_INT) != 1){
			materialSubOrderPO.setOtherStatus(materialSubOrderPO.getOtherStatus() + MaterialSubOrderPO.OTHER_STATUS_MEND_INT);
		}
		
		materialSubOrderDao.saveOrUpdate(materialSubOrderPO);
		
		if(materialSubOrderItemVOs != null){
			
			float _total = MaterialSubOrderItemServiceImpl.packageMaterialSubOrderItem(materialSubOrderPO, materialSubOrderItemVOs, packageItems);
			
			total = Arith.add(total, _total);
			
			for(String packageName: packageItems.keySet()){
				List<MaterialSubOrderItemPO> tmpItems = packageItems.get(packageName);
				for(MaterialSubOrderItemPO materialSubOrderItemPO: tmpItems){
					materialSubOrderItemDao.save(materialSubOrderItemPO);
				}
			}
		}
		
		materialSubOrderPO.setTotal(total);
		materialSubOrderDao.save(materialSubOrderPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deliverMaterialSubOrder(MaterialSubOrderVO materialSubOrderVO, String userId) throws FLException {
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(materialSubOrderVO.getMsoId());
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		int fullStatus = materialSubOrderPO.getFullStatus();
		
		if(materialSubOrderPO.getDeliveryStatus() != MaterialSubOrderPO.DELIVERY_STATUS_TYPE_INIT_INT || fullStatus == MaterialSubOrderPO.FINANCE_STATUS_TYPE_INIT_INT || fullStatus == MaterialSubOrderPO.FINANCE_STATUS_TYPE_APPROVAL_INT){
			throw new FLException(180015, "主材订单当前状态不能置为已送货");
		}
		
		materialSubOrderPO.setDeliveryStatus(MaterialSubOrderPO.DELIVERY_STATUS_TYPE_DELIVE_INT);
		materialSubOrderPO.setDeliveryTime(DateUtil.getDateToTimestamp(new Date()));
		materialSubOrderPO.setDeliveryUserId(userId);
		
		materialSubOrderDao.update(materialSubOrderPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int changeMaterialSubOrderForOrderId(String msoNo, String orderId, String userId) throws FLException{
		
		String oldOrderId = "";
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryDecorationOrderByOrderId(orderId);
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.queryMaterialSubOrderByMsoNo(msoNo);
		
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		if(decorationOrderPO != null && materialSubOrderPO != null){
			
			oldOrderId = materialSubOrderPO.getOrderId();
			
			materialSubOrderPO.setOrderId(orderId);
			
			StringBuffer orderAddr = new StringBuffer();
			orderAddr.append(decorationOrderPO.getVillagePO().getVillageName());
			orderAddr.append(" ");
			orderAddr.append(decorationOrderPO.getHouseNumber());
			
			materialSubOrderPO.setOrderAddr(orderAddr.toString());
			materialSubOrderPO.setCustomerId(decorationOrderPO.getCustomerPO().getCustomerId());
			materialSubOrderPO.setCustomerName(decorationOrderPO.getCustomerPO().getCustomerName());
			
			List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByMsoId(materialSubOrderPO.getMsoId(), null);
			for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){
				materialPaymentPO.setCustomerId(decorationOrderPO.getCustomerPO().getCustomerId());
				materialPaymentPO.setCustomerName(decorationOrderPO.getCustomerPO().getCustomerName());
				
				materialPaymentDao.update(materialPaymentPO);
			}
			
			materialSubOrderDao.update(materialSubOrderPO);
			
			ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
			serviceRecordPO.setType(ServiceRecordPO.TYPE_TYPE_CHANGE_MATERIALSUBORDER_ORDERID_INT);
			serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			serviceRecordPO.setOperateUserId(userId);
			serviceRecordPO.setInfo(String.format("主材子订单修改订单编号,主材子订单编号:%s,原订单编号为:%s,修改订单编号为:%s", msoNo, oldOrderId, orderId));
			
			serviceRecordDao.saveOrUpdate(serviceRecordPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialSubOrderForPreBalancePT(MaterialSubOrderVO materialSubOrderVO, int caclType){
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(materialSubOrderVO.getMsoId());
		
		if(materialSubOrderPO != null){
			if(caclType == MaterialSubOrderItemPO.CALCTYPE_TYPE_BASE_INT){
				materialSubOrderPO.setBase(materialSubOrderVO.getBase());
			}else{
				materialSubOrderPO.setPoint(materialSubOrderVO.getPoint());
			}
			
			List<MaterialSubOrderItemPO> materialSubOrderItemPOs = materialSubOrderItemDao.queryMaterialSubOrderItemByMsoId(materialSubOrderVO.getMsoId());
			for(MaterialSubOrderItemPO materialSubOrderItemPO: materialSubOrderItemPOs){
				if(materialSubOrderItemPO.getCalcType() == caclType && materialSubOrderItemPO.getCalcType() == MaterialSubOrderItemPO.CALCTYPE_TYPE_BASE_INT){
					materialSubOrderItemPO.setPrePoint(materialSubOrderVO.getBase());
				}else if(materialSubOrderItemPO.getCalcType() == caclType && materialSubOrderItemPO.getCalcType() == MaterialSubOrderItemPO.CALCTYPE_TYPE_POINT_INT){
					materialSubOrderItemPO.setPrePoint(materialSubOrderVO.getPoint());
				}
				
				materialSubOrderItemDao.update(materialSubOrderItemPO);
			}
			
			materialSubOrderDao.update(materialSubOrderPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialSubOrderMaling(MaterialSubOrderVO materialSubOrderVO){
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(materialSubOrderVO.getMsoId());
		
		if(materialSubOrderPO != null){
			materialSubOrderPO.setMaling(materialSubOrderVO.getMaling());
			materialSubOrderPO.setVenderMaling(materialSubOrderVO.getVenderMaling());
			
			materialSubOrderDao.update(materialSubOrderPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialSubOrderForCoupon(	MaterialSubOrderVO materialSubOrderVO){
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(materialSubOrderVO.getMsoId());
		
		if(materialSubOrderPO != null){
			
			materialSubOrderPO.setCoupon(materialSubOrderVO.getCoupon());
			materialSubOrderPO.setCouponInfo(materialSubOrderVO.getCouponInfo());
			
			materialSubOrderDao.update(materialSubOrderPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void passBalanceMaterialSubOrder(List<Long> msoIds) {
		
		for(Long msoId: msoIds){
			MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(msoId);
			
			if(materialSubOrderPO != null && materialSubOrderPO.getStatus() == MaterialSubOrderPO.STATUS_TYPE_INIT_INT && materialSubOrderPO.getBalanceStatus() == MaterialSubOrderPO.BALANCE_STATUS_TYPE_INIT_INT){
				materialSubOrderPO.setStatus(MaterialSubOrderPO.STATUS_TYPE_FINISH_INT);
				
				materialSubOrderDao.update(materialSubOrderPO);
			}
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void preBalanceMaterialSubOrder(List<Long> msoIds, String userId, String userName){
		
		float totalBalance;
		List<String> materialSubOrderItemPackageNameList = new ArrayList<String>();
		
		for(Long msoId: msoIds){
			MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(msoId);
			
			if(materialSubOrderPO != null && materialSubOrderPO.getStatus() == MaterialSubOrderPO.STATUS_TYPE_INIT_INT && materialSubOrderPO.getBalanceStatus() == MaterialSubOrderPO.BALANCE_STATUS_TYPE_INIT_INT){
				
				totalBalance = 0;
				
				List<MaterialSubOrderItemPO> materialSubOrderItemPOs = materialSubOrderItemDao.queryMaterialSubOrderItemByMsoId(msoId);
				for(MaterialSubOrderItemPO materialSubOrderItemPO: materialSubOrderItemPOs){
					materialSubOrderItemPO.setBalanceStatus(MaterialSubOrderItemPO.BALANCESTATUS_TYPE_PREBALANCE_INT);
					materialSubOrderItemPO.setPostPoint(materialSubOrderItemPO.getPrePoint());
					
					float balance = 0;
					
					float salePrice = materialSubOrderItemPO.getSalePrice(); // 折扣价
					float price = materialSubOrderItemPO.getPrice(); // 售价
					float total = materialSubOrderItemPO.getTotal(); // 总价
					float num = materialSubOrderItemPO.getNum(); // 数量
					
					float prePoint = materialSubOrderItemPO.getPrePoint(); // 预结算点位;
					
					if(!"".equals(materialSubOrderItemPO.getPackageName())){
						if(materialSubOrderItemPackageNameList.indexOf(msoId.toString() + materialSubOrderItemPO.getPackageName()) == -1){
							// 利润 : 总价 * 点位 , 成本 : 总价 * (1 - 点位)
							balance = Arith.mul(total, prePoint);
							materialSubOrderItemPackageNameList.add(msoId.toString() + materialSubOrderItemPO.getPackageName());
						}
					}else{
						if(materialSubOrderItemPO.getCalcType() == MaterialSubOrderItemPO.CALCTYPE_TYPE_BASE_INT){
							// 利润 : (售价 - 底价) * 数量 , 成本 : 底价 * 数量
							balance = Arith.mul((Arith.sub(price, prePoint)), num);
						}else if(materialSubOrderItemPO.getCalcType() == MaterialSubOrderItemPO.CALCTYPE_TYPE_POINT_INT){
							// 利润 : (售价 - 折扣价 * (1 - 点位)) * 数量 , 成本 : 折扣价 * (1 - 点位) * 数量
							balance = Arith.mul(Arith.sub(price, Arith.mul(salePrice, Arith.sub(1f, prePoint))), num);
						}
					}
					
					totalBalance = Arith.add(totalBalance, balance);
					
					materialSubOrderItemDao.update(materialSubOrderItemPO);
				}
				
				totalBalance = Arith.sub(totalBalance, materialSubOrderPO.getMaling());
				
				materialSubOrderPO.setProfit(Arith.add(materialSubOrderPO.getProfit(), totalBalance));
				materialSubOrderPO.setPreBalanceTime(DateUtil.getDateToTimestamp(new Date()));
				materialSubOrderPO.setStatus(MaterialSubOrderPO.STATUS_TYPE_PREBALANCE_INT);
				materialSubOrderPO.setBalanceStatus(MaterialSubOrderPO.BALANCE_STATUS_TYPE_PRE_INT);
				materialSubOrderDao.update(materialSubOrderPO);
				
				MaterialSubOrderBalancePO materialSubOrderBalancePO = new MaterialSubOrderBalancePO();
				materialSubOrderBalancePO.setMaterialSubOrder(materialSubOrderPO);
				materialSubOrderBalancePO.setCreater(new UserPO(userId));
				materialSubOrderBalancePO.setInstorer(materialSubOrderPO.getInstoreId() == null ? null : new UserPO(materialSubOrderPO.getInstoreId()));
				materialSubOrderBalancePO.setBalanceTime(DateUtil.getDateToTimestamp(new Date()));
				materialSubOrderBalancePO.setBalance(totalBalance);
				materialSubOrderBalancePO.setDifference(Arith.sub(materialSubOrderPO.getTotal(), totalBalance));
				materialSubOrderBalancePO.setType(MaterialSubOrderBalancePO.TYPE_ADD_INT);
				materialSubOrderBalancePO.setStatus(MaterialSubOrderBalancePO.STATUS_PRE_BALANCE_INT);
				
				materialSubOrderBalanceDao.save(materialSubOrderBalancePO);
			}
		}
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void postBalanceMaterialSubOrder(MaterialSubOrderVO materialSubOrderVO, String userId, String userName) throws FLException{
		
		long msoId = materialSubOrderVO.getMsoId();
		
		float totalBalance;
		List<String> materialSubOrderItemPackageNameList = new ArrayList<String>();
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(msoId);
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		totalBalance = 0;
		
		if(materialSubOrderPO != null && materialSubOrderPO.getBalanceStatus() == MaterialSubOrderItemPO.BALANCESTATUS_TYPE_PREBALANCE_INT){
			materialSubOrderPO.setBalanceStatus(MaterialSubOrderPO.BALANCE_STATUS_TYPE_POST_INT);
			
			List<MaterialSubOrderItemPO> materialSubOrderItemPOs = materialSubOrderItemDao.queryMaterialSubOrderItemByMsoId(msoId);
			for(MaterialSubOrderItemPO materialSubOrderItemPO: materialSubOrderItemPOs){
				materialSubOrderItemPO.setBalanceStatus(MaterialSubOrderItemPO.BALANCESTATIS_TYPE_POSTBALANCE_INT);
				
				float balance = 0;
				
				float salePrice = materialSubOrderItemPO.getSalePrice(); // 折扣价
				float num = materialSubOrderItemPO.getNum();
				float total = materialSubOrderItemPO.getTotal();
				float prePoint = materialSubOrderItemPO.getPrePoint();
				float postPoint = materialSubOrderItemPO.getPostPoint();
				
				if(!"".equals(materialSubOrderItemPO.getPackageName())){
					if(materialSubOrderItemPackageNameList.indexOf(String.valueOf(msoId) + materialSubOrderItemPO.getPackageName()) == -1){
						// 利润 : 总价 * (结算点位 - 预结算点位) * 0.5 , 成本 : 总价 * (预结算点位 - 结算点位)
						balance = Arith.mul(total, Arith.sub(postPoint, prePoint));
						
						materialSubOrderItemPackageNameList.add(String.valueOf(msoId) + materialSubOrderItemPO.getPackageName());
					}
				}else{
					if(materialSubOrderItemPO.getCalcType() == MaterialSubOrderItemPO.CALCTYPE_TYPE_BASE_INT){
						// 利润 : (预结算底价 - 结算底价) * 数量 * 0.5 , 成本 : (结算底价 - 预结算底价) * 数量
						balance = Arith.mul(Arith.sub(prePoint, postPoint), num);
					}else if(materialSubOrderItemPO.getCalcType() == MaterialSubOrderItemPO.CALCTYPE_TYPE_POINT_INT){
						// 利润 : 折扣价 * (结算点位 - 预结算点位) * 数量 * 0.5 , 成本 : 折扣价 * (预结算点位 - 结算点位) * 数量
						balance = Arith.mul(Arith.mul(salePrice, Arith.sub(postPoint, prePoint)), num);
					}
				}
				
				totalBalance = Arith.add(totalBalance, balance);
				
				materialSubOrderItemDao.update(materialSubOrderItemPO);
			}
			
			materialSubOrderPO.setCustProfit(materialSubOrderVO.getCustProfit());
			materialSubOrderPO.setPostProfit(Arith.add(materialSubOrderPO.getProfit(), totalBalance));
			materialSubOrderPO.setPostBalanceTime(DateUtil.getDateToTimestamp(new Date()));
			materialSubOrderPO.setStatus(MaterialSubOrderPO.STATUS_TYPE_POSTBALANCE_INT);
			materialSubOrderPO.setBalanceStatus(MaterialSubOrderPO.BALANCE_STATUS_TYPE_POST_INT);
			
			materialSubOrderDao.update(materialSubOrderPO);
		}
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteMaterialSubOrder(long msoId) throws FLException{
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(msoId);
		
		if(materialSubOrderPO != null){
			
			if(materialSubOrderPO.getStatus() == MaterialSubOrderPO.STATUS_TYPE_INIT_INT && materialSubOrderPO.getBalanceStatus() == MaterialSubOrderPO.BALANCE_STATUS_TYPE_INIT_INT && 
				materialSubOrderPO.getFullStatus() == MaterialSubOrderPO.FINANCE_STATUS_TYPE_INIT_INT && materialSubOrderPO.getDepositStatus() == MaterialSubOrderPO.FINANCE_STATUS_TYPE_INIT_INT){
				
				materialSubOrderItemDao.deleteMaterialSubOrderItemByMsoId(msoId);
				
				materialSubOrderPO.setStatus(MaterialSubOrderPO.STATUS_TYPE_DELETE_INT);
				
				materialSubOrderDao.update(materialSubOrderPO);
				
				return 0;
			}
		}
		
		throw new FLException(180009, "主材订单当前状态不能删除");
	}
}
