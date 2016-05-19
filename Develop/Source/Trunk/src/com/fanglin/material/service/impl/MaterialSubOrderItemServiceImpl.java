/**
 * @File Name		: MaterialSubOrderItemServiceImpl.java
 * @Package   	: com.fanglin.service.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
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
import com.fanglin.material.service.MaterialSubOrderItemService;
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
import com.fanglin.utils.SystemConfig;

@Service("materialSubOrderItemService")
@Transactional(readOnly=true)
public class MaterialSubOrderItemServiceImpl implements MaterialSubOrderItemService {
	
	public static int MATERIAL_LIMIT_INT = 10;
	
	@Autowired
	private MaterialSubOrderDao materialSubOrderDao;
	
	@Autowired
	private MaterialSubOrderItemDao materialSubOrderItemDao;
	
	@Autowired
	private MaterialSubOrderRefundDao materialSubOrderRefundDao;
	
	@Autowired
	private MaterialPaymentDao materialPaymentDao;
	
	@Autowired
	private MaterialSubOrderPreBalanceDao materialSubOrderPreBalanceDao;
	
	@Autowired
	private MaterialSubOrderPostBalanceDao materialSubOrderPostBalanceDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public void pageMaterialSubOrderItemByMsoId(Paging paging, List<FilterVO> filters, long msoId){
		
		List<MaterialSubOrderItemPO> materialSubOrderItemPOs = materialSubOrderItemDao.pageMaterialSubOrderItemByMsoId(paging, filters, msoId);
		List<MaterialSubOrderItemVO> materialSubOrderItemVOs = new ArrayList<MaterialSubOrderItemVO>();
		
		for(MaterialSubOrderItemPO materialSubOrderItemPO: materialSubOrderItemPOs){
			MaterialSubOrderItemVO materialSubOrderItemVO = new MaterialSubOrderItemVO();
			BeanUtil.copyProperties(materialSubOrderItemPO, materialSubOrderItemVO);
			materialSubOrderItemVOs.add(materialSubOrderItemVO);
		}
		
		paging.setData(materialSubOrderItemVOs);
	}
	
	@Override
	public List<MaterialSubOrderItemVO> queryMaterialSubOrderItemByOrderId(String orderId){
		
		List<MaterialSubOrderPO> materialSubOrderPOs = materialSubOrderDao.queryMaterialSubOrderByOrderId(orderId);
		List<Long> msoIds = new ArrayList<Long>();
		
		for(MaterialSubOrderPO materialSubOrderPO: materialSubOrderPOs){
			msoIds.add(materialSubOrderPO.getMsoId());
		}
		
		if(msoIds.size() == 0){
			return new ArrayList<MaterialSubOrderItemVO>();
		}
		
		List<MaterialSubOrderItemPO> materialSubOrderItemPOs = materialSubOrderItemDao.queryMaterialSubOrderItemByMsoIds(msoIds);
		List<MaterialSubOrderItemVO> materialSubOrderItemVOs = packageMaterialSubOrderItems(materialSubOrderItemPOs);
		
		return materialSubOrderItemVOs;
	}

	@Override
	public List<MaterialSubOrderItemVO> queryMaterialSubOrderItemByMsoId(long msoId){
		
		List<MaterialSubOrderItemPO> materialSubOrderItemPOs = materialSubOrderItemDao.queryMaterialSubOrderItemByMsoId(msoId);
		List<MaterialSubOrderItemVO> materialSubOrderItemVOs = packageMaterialSubOrderItems(materialSubOrderItemPOs);
		
		return materialSubOrderItemVOs;
	}
	
	@Override
	public List<MaterialSubOrderItemVO> queryMaterialSubOrderItemByMsoiIds(List<Long> msoiIds){

		List<MaterialSubOrderItemPO> materialSubOrderItemPOs = materialSubOrderItemDao.queryMaterialSubOrderItemByMsoiIds(msoiIds);
		List<MaterialSubOrderItemVO> materialSubOrderItemVOs = packageMaterialSubOrderItems(materialSubOrderItemPOs);
		
		return materialSubOrderItemVOs;
	}
	
	@Override
	public MaterialSubOrderItemVO queryMaterialSubOrderItemForSaleByMsoiId(MaterialSubOrderItemVO materialSubOrderItemVO) {
		
		MaterialSubOrderItemPO materialSubOrderItemPO = materialSubOrderItemDao.queryMaterialSubOrderItemByMsoiId(materialSubOrderItemVO.getMsoiId());
		
		BeanUtil.copyProperties(materialSubOrderItemPO, materialSubOrderItemVO, "msoiId");
		
		materialSubOrderItemVO.setPrePoint(materialSubOrderItemPO.getRawPoint());
		materialSubOrderItemVO.setCalcType(materialSubOrderItemPO.getRawCalcType());
		
		if(materialSubOrderItemPO.getRawCalcType() == MaterialSubOrderItemPO.CALCTYPE_TYPE_BASE_INT){
			materialSubOrderItemVO.setBase(materialSubOrderItemPO.getRawPoint());
		}else if(materialSubOrderItemPO.getRawCalcType() == MaterialSubOrderItemPO.CALCTYPE_TYPE_POINT_INT){
			materialSubOrderItemVO.setPoint(materialSubOrderItemPO.getRawPoint());
		}
		
		return materialSubOrderItemVO;
	}

	@Override
	public List<MaterialSubOrderItemVO> queryMaterialSubOrderItemForNoPackageByMsoiId(List<Long> msoiIds){

		List<MaterialSubOrderItemPO> materialSubOrderItemPOs = materialSubOrderItemDao.queryMaterialSubOrderItemByMsoiIds(msoiIds);
		List<MaterialSubOrderItemVO> materialSubOrderItemVOs = new ArrayList<MaterialSubOrderItemVO>();
		
		for(MaterialSubOrderItemPO materialSubOrderItemPO: materialSubOrderItemPOs){
			MaterialSubOrderItemVO materialSubOrderItemVO = new MaterialSubOrderItemVO();
			BeanUtil.copyProperties(materialSubOrderItemPO, materialSubOrderItemVO);
			
			materialSubOrderItemVOs.add(materialSubOrderItemVO);
		}
		
		return materialSubOrderItemVOs;
	}
	
	@Override
	public List<MaterialSubOrderItemVO> queryMaterialSubOrderItemForNameByName(MaterialSubOrderItemVO materialSubOrderItemVO) {
		
		List<MaterialSubOrderItemPO> materialSubOrderItemPOs = materialSubOrderItemDao.queryMaterialSubOrderItemByName(materialSubOrderItemVO.getMsoId(), materialSubOrderItemVO.getMaterialModelName(), MATERIAL_LIMIT_INT);
		List<MaterialSubOrderItemVO> materialSubOrderItemVOs = new ArrayList<MaterialSubOrderItemVO>();
		
		for(MaterialSubOrderItemPO materialSubOrderItemPO: materialSubOrderItemPOs){
			materialSubOrderItemVO = new MaterialSubOrderItemVO();
			BeanUtil.copyProperties(materialSubOrderItemPO, materialSubOrderItemVO);
			
			materialSubOrderItemVOs.add(materialSubOrderItemVO);
		}
		
		return materialSubOrderItemVOs;
	}

	@Override
	public List<MaterialSubOrderItemVO> queryMaterialSubOrderItemForNameByNo(MaterialSubOrderItemVO materialSubOrderItemVO) {
		
		List<MaterialSubOrderItemPO> materialSubOrderItemPOs = materialSubOrderItemDao.queryMaterialSubOrderItemByNo(materialSubOrderItemVO.getMsoId(), materialSubOrderItemVO.getMaterialModelName(), MATERIAL_LIMIT_INT);
		List<MaterialSubOrderItemVO> materialSubOrderItemVOs = new ArrayList<MaterialSubOrderItemVO>();
		
		for(MaterialSubOrderItemPO materialSubOrderItemPO: materialSubOrderItemPOs){
			materialSubOrderItemVO = new MaterialSubOrderItemVO();
			BeanUtil.copyProperties(materialSubOrderItemPO, materialSubOrderItemVO);
			
			materialSubOrderItemVOs.add(materialSubOrderItemVO);
		}
		
		return materialSubOrderItemVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addMaterialSubOrderItem(MaterialSubOrderVO materialSubOrderVO, List<MaterialSubOrderItemVO> materialSubOrderItemVOs) throws FLException{
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(materialSubOrderVO.getMsoId());
		
		float total = 0;
		Map<String, List<MaterialSubOrderItemPO>> packageItems = new HashMap<String, List<MaterialSubOrderItemPO>>();
		Map<String, List<MaterialSubOrderItemPO>> originalPackageItems = new HashMap<String, List<MaterialSubOrderItemPO>>();
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		if(materialSubOrderPO.getFullStatus() != MaterialSubOrderPO.FINANCE_STATUS_TYPE_INIT_INT){
			throw new FLException(180006, "主材订单状态不能添加型号");
		}
		
		if(materialSubOrderItemVOs == null){
			throw new FLException(180016, "主材订单添加型号不存在");
		}
		
		materialSubOrderPO.setCouponInfo("");
		
		total = Arith.add(materialSubOrderPO.getTotal(), total);
		
		List<MaterialSubOrderItemPO> materialSubOrderItemPOs = materialSubOrderItemDao.queryMaterialSubOrderItemByMsoIdNotRefund(materialSubOrderVO.getMsoId());
		
		for(MaterialSubOrderItemPO materialSubOrderItemPO: materialSubOrderItemPOs){
			
			String packageName = materialSubOrderItemPO.getPackageName();
			
			if(!"".equals(packageName)){
				if(originalPackageItems.containsKey(packageName)){
					originalPackageItems.get(packageName).add(materialSubOrderItemPO);
				}else{
					List<MaterialSubOrderItemPO> _materialSubOrderItemPOs = new ArrayList<MaterialSubOrderItemPO>();
					_materialSubOrderItemPOs.add(materialSubOrderItemPO);
					originalPackageItems.put(packageName, _materialSubOrderItemPOs);
				}
			}
		}
		
		if(materialSubOrderItemVOs != null){
			
			float _total = packageMaterialSubOrderItem(materialSubOrderPO, materialSubOrderItemVOs, packageItems);
			
			total = Arith.add(total, _total);
			
			for(String packageName: packageItems.keySet()){
				
				float tmpTotal = 0;
				List<MaterialSubOrderItemPO> tmpItems = packageItems.get(packageName);
				
				if(originalPackageItems.containsKey(packageName)){
					
					tmpTotal = tmpItems.get(0).getTotal();
					float _tmpTotal = tmpItems.get(0).getTotal();
					List<MaterialSubOrderItemPO> tmpOriginalItems = originalPackageItems.get(packageName);
					
					for(MaterialSubOrderItemPO materialSubOrderItemPO: tmpOriginalItems){
						
						tmpTotal = materialSubOrderItemPO.getTotal();
						
						materialSubOrderItemPO.setTotal(Arith.add(materialSubOrderItemPO.getTotal(), _tmpTotal));
						materialSubOrderItemDao.save(materialSubOrderItemPO);
					}
					
				}
				
				for(MaterialSubOrderItemPO materialSubOrderItemPO: tmpItems){
					materialSubOrderItemPO.setTotal(Arith.add(materialSubOrderItemPO.getTotal(), tmpTotal));
					
					materialSubOrderItemDao.save(materialSubOrderItemPO);
				}
			}
		}
		
		materialSubOrderPO.setTotal(Arith.round(total, 2));
		materialSubOrderDao.save(materialSubOrderPO);
			
		return 0;
	}
	
	private List<MaterialSubOrderItemVO> packageMaterialSubOrderItems(List<MaterialSubOrderItemPO> materialSubOrderItemPOs){
		
		List<MaterialSubOrderItemVO> materialSubOrderItemVOs = new ArrayList<MaterialSubOrderItemVO>();
		
		Map<String, MaterialSubOrderItemVO> packageFlagMap = new HashMap<String, MaterialSubOrderItemVO>();
		Map<String, List<MaterialSubOrderItemVO>> packageItemsMap = new HashMap<String, List<MaterialSubOrderItemVO>>();
		
		List<MaterialSubOrderItemVO> packageItemsList = null;
		
		int _id = 0;
		
		for(MaterialSubOrderItemPO materialSubOrderItemPO: materialSubOrderItemPOs){
			MaterialSubOrderItemVO materialSubOrderItemVO = new MaterialSubOrderItemVO();
			BeanUtil.copyProperties(materialSubOrderItemPO, materialSubOrderItemVO);
			
			if(materialSubOrderItemPO.getNum() == 0){
				continue;
			}
			
			materialSubOrderItemVO.setIsLeaf(true);
			materialSubOrderItemVO.setExpanded(false);
			
			if(!materialSubOrderItemPO.getPackageName().equals("")){
				
				String packageName = materialSubOrderItemPO.getPackageName();
				MaterialSubOrderItemVO materialSubOrderItemPackage = null;
				
				if(!packageFlagMap.containsKey(packageName)){
					materialSubOrderItemPackage = new MaterialSubOrderItemVO();
					
					materialSubOrderItemPackage.setMaterialTypeName("-");
					materialSubOrderItemPackage.setMaterialBrandName("-");
					materialSubOrderItemPackage.setMeasurementUnitName("-");
					materialSubOrderItemPackage.setDes("-");
					
					materialSubOrderItemPackage.setMaterialModelNo(packageName);
					materialSubOrderItemPackage.setMaterialModelName(packageName);
					materialSubOrderItemPackage.setPackageName(packageName);
					materialSubOrderItemPackage.setTotal(materialSubOrderItemPO.getTotal());
					materialSubOrderItemPackage.setMsoId(materialSubOrderItemPO.getMsoId());
					
					materialSubOrderItemPackage.setLevel(0);
					materialSubOrderItemPackage.setIsLeaf(false);
					materialSubOrderItemPackage.setParent(-1);
					materialSubOrderItemPackage.setExpanded(true);
					
					materialSubOrderItemPackage.setCalcType(MaterialSubOrderItemPO.CALCTYPE_TYPE_POINT_INT);
					
					materialSubOrderItemPackage.setPrePoint(materialSubOrderItemPO.getPrePoint());
					materialSubOrderItemPackage.setPostPoint(materialSubOrderItemPO.getPostPoint());
					
					materialSubOrderItemVO.setLevel(1);
					materialSubOrderItemVO.setTotal(0);
					materialSubOrderItemVO.setPrePoint(0);
					materialSubOrderItemVO.setPostPoint(0);
					
					packageFlagMap.put(packageName, materialSubOrderItemPackage);
					
					packageItemsList = new ArrayList<MaterialSubOrderItemVO>();
					packageItemsList.add(materialSubOrderItemVO);
					
					packageItemsMap.put(packageName, packageItemsList);
					
				}else{
					packageItemsList = packageItemsMap.get(packageName);
					
					materialSubOrderItemPackage = packageFlagMap.get(packageName);
					materialSubOrderItemVO.setLevel(1);
					materialSubOrderItemVO.setTotal(0);
					materialSubOrderItemVO.setPrePoint(0);
					materialSubOrderItemVO.setPostPoint(0);
					
					packageItemsList.add(materialSubOrderItemVO);
				}
			}else{
				if(materialSubOrderItemVO.getNum() > 0){
					materialSubOrderItemVO.setId(++_id);
					materialSubOrderItemVO.setLevel(0);
					materialSubOrderItemVO.setParent(-1);
					materialSubOrderItemVOs.add(materialSubOrderItemVO);
				}
			}
		}
		
		for(String packageName: packageFlagMap.keySet()){
			MaterialSubOrderItemVO packageItem = packageFlagMap.get(packageName);
			
			if(packageItem.getTotal() > 0){
				packageItem.setId(++_id);
				materialSubOrderItemVOs.add(packageItem);
				
				packageItemsList = packageItemsMap.get(packageName);
				
				for(MaterialSubOrderItemVO materialSubOrderItemVO: packageItemsList){
					materialSubOrderItemVO.setId(++_id);
					materialSubOrderItemVO.setParent(packageItem.getId());
					
					materialSubOrderItemVOs.add(materialSubOrderItemVO);
				}
			}
		}
		
		return materialSubOrderItemVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialSubOrderItemForModel(MaterialSubOrderVO materialSubOrderVO, MaterialSubOrderItemVO materialSubOrderItemVO) throws FLException{
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(materialSubOrderVO.getMsoId());
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		if(materialSubOrderPO.getFullStatus() != MaterialSubOrderPO.FINANCE_STATUS_TYPE_INIT_INT){
			throw new FLException(180010, "主材订单当前状态不能更新型号");
		}
		
		MaterialSubOrderItemPO materialSubOrderItemPO = materialSubOrderItemDao.get(materialSubOrderItemVO.getMsoiId());
		
		float originalTotal = 0;
		
		if(materialSubOrderItemPO != null && materialSubOrderItemPO.getStatus() == MaterialSubOrderItemPO.STATUS_TYPE_INIT_INT && materialSubOrderItemPO.getBalanceStatus() == MaterialSubOrderItemPO.BALANCESTATUS_TYPE_INIT_INT){
			originalTotal = materialSubOrderItemPO.getTotal();
			
			materialSubOrderItemPO.setMaterialModelNo(materialSubOrderItemVO.getMaterialModelNo());
			materialSubOrderItemPO.setMaterialBrandName(materialSubOrderItemVO.getMaterialBrandName());
			materialSubOrderItemPO.setMaterialModelName(materialSubOrderItemVO.getMaterialModelName());
			materialSubOrderItemPO.setMaterialTypeName(materialSubOrderItemVO.getMaterialTypeName());
			materialSubOrderItemPO.setMeasurementUnitName(materialSubOrderItemVO.getMeasurementUnitName());
			
			materialSubOrderItemPO.setNum(materialSubOrderItemVO.getNum());
			materialSubOrderItemPO.setTotal(materialSubOrderItemVO.getTotal());
			
			materialSubOrderItemDao.update(materialSubOrderItemPO);
			
			materialSubOrderPO.setTotal(Arith.add(Arith.sub(materialSubOrderItemVO.getTotal(), originalTotal), materialSubOrderPO.getTotal()));
			materialSubOrderDao.update(materialSubOrderPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialSubOrderItemForPackage(MaterialSubOrderVO materialSubOrderVO, List<MaterialSubOrderItemVO> materialSubOrderItemVOs) throws FLException{
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(materialSubOrderVO.getMsoId());
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		if(materialSubOrderPO.getFullStatus() != MaterialSubOrderPO.FINANCE_STATUS_TYPE_INIT_INT){
			throw new FLException(180010, "主材订单当前状态不能更新型号");
		}
		
		float originalTotal = 0;
		float total = 0;
		
		for(MaterialSubOrderItemVO materialSubOrderItemVO: materialSubOrderItemVOs){
			MaterialSubOrderItemPO materialSubOrderItemPO = materialSubOrderItemDao.get(materialSubOrderItemVO.getMsoiId());
			
			if(materialSubOrderItemPO != null && materialSubOrderItemPO.getStatus() == MaterialSubOrderItemPO.STATUS_TYPE_INIT_INT && materialSubOrderItemPO.getBalanceStatus() == MaterialSubOrderItemPO.BALANCESTATUS_TYPE_INIT_INT){
				originalTotal = materialSubOrderItemPO.getTotal();
				total = materialSubOrderItemVO.getTotal();
				
				materialSubOrderItemPO.setMaterialModelNo(materialSubOrderItemVO.getMaterialModelNo());
				materialSubOrderItemPO.setMaterialBrandName(materialSubOrderItemVO.getMaterialBrandName());
				materialSubOrderItemPO.setMaterialModelName(materialSubOrderItemVO.getMaterialModelName());
				materialSubOrderItemPO.setMaterialTypeName(materialSubOrderItemVO.getMaterialTypeName());
				materialSubOrderItemPO.setMeasurementUnitName(materialSubOrderItemVO.getMeasurementUnitName());
				
				materialSubOrderItemPO.setPackageName(materialSubOrderItemVO.getPackageName());
				materialSubOrderItemPO.setNum(materialSubOrderItemVO.getNum());
				materialSubOrderItemPO.setTotal(materialSubOrderItemVO.getTotal());
				materialSubOrderItemPO.setDes(materialSubOrderItemVO.getDes());
				
				materialSubOrderItemDao.update(materialSubOrderItemPO);
			}
		}
		
		materialSubOrderPO.setTotal(Arith.add(Arith.sub(total, originalTotal), materialSubOrderPO.getTotal()));
		materialSubOrderDao.update(materialSubOrderPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialSubOrderItemForPrePT(List<Long> msoiIds, MaterialSubOrderItemVO materialSubOrderItemVO){
		
		for(Long msoiId: msoiIds){
			MaterialSubOrderItemPO materialSubOrderItemPO = materialSubOrderItemDao.get(msoiId);
			if(materialSubOrderItemPO != null && materialSubOrderItemPO.getBalanceStatus() == MaterialSubOrderItemPO.BALANCESTATUS_TYPE_INIT_INT){
				materialSubOrderItemPO.setPrePoint(materialSubOrderItemVO.getPrePoint());
				
				materialSubOrderItemDao.update(materialSubOrderItemPO);
			}
		}
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialSubOrderItemForPostPT(List<Long> msoiIds, MaterialSubOrderItemVO materialSubOrderItemVO){
		
		for(Long msoiId: msoiIds){
			MaterialSubOrderItemPO materialSubOrderItemPO = materialSubOrderItemDao.get(msoiId);
			if(materialSubOrderItemPO != null && materialSubOrderItemPO.getBalanceStatus() == MaterialSubOrderItemPO.BALANCESTATIS_TYPE_POSTBALANCE_INT){
				materialSubOrderItemPO.setPostPoint(materialSubOrderItemVO.getPostPoint());
				
				materialSubOrderItemDao.update(materialSubOrderItemPO);
			}
		}
	}
	

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refundMaterialSubOrderItemForModel(MaterialSubOrderVO materialSubOrderVO, MaterialSubOrderItemVO materialSubOrderItemVO, long msoId, String userId, String userName){
		
		int redirect = 0;
		
		MaterialSubOrderPO materialSubOrderPO = null;
		MaterialSubOrderItemPO materialSubOrderItemPO = materialSubOrderItemDao.get(materialSubOrderItemVO.getMsoiId());
		
		int ident = new Random().nextInt(9999);
		
		if(materialSubOrderItemPO != null){
			
			msoId = materialSubOrderItemPO.getMsoId();
			
			float refundTotal = Arith.mul(materialSubOrderItemPO.getPrice(), materialSubOrderItemVO.getNum());
			
			MaterialSubOrderRefundPO materialSubOrderRefundPO = new MaterialSubOrderRefundPO();
			BeanUtil.copyProperties(materialSubOrderItemPO, materialSubOrderRefundPO);
			materialSubOrderRefundPO.setIdent(ident);
			materialSubOrderRefundPO.setNum(materialSubOrderItemVO.getNum());
			materialSubOrderRefundPO.setTotal(refundTotal);
			materialSubOrderRefundPO.setStatus(MaterialSubOrderRefundPO.STATUS_TYPE_REFUND_INT);
			materialSubOrderRefundPO.setBalanceType(materialSubOrderItemPO.getBalanceStatus());
			materialSubOrderRefundPO.setRefundDes(materialSubOrderVO.getRefundDes());
			
			MaterialPaymentPO materialPaymentPO = new MaterialPaymentPO();
			
			materialPaymentPO.setMsoId(msoId);
			materialPaymentPO.setMsoNo(materialSubOrderVO.getMsoNo());
			
			materialPaymentPO.setMaterialType(materialSubOrderRefundPO.getMaterialTypeName());
			materialPaymentPO.setMaterialBrand(materialSubOrderRefundPO.getMaterialBrandName());
			
			UserPO userPO = userDao.get(userId);
			if(userPO != null){
				materialPaymentPO.setCreateUserId(userPO.getUserId());
				materialPaymentPO.setCreateUserName(userPO.getCurrentName());
			}else{
				materialPaymentPO.setCreateUserId("");
				materialPaymentPO.setCreateUserName("");
			}
			
			materialPaymentPO.setCustomerId(materialSubOrderVO.getCustomerId());
			materialPaymentPO.setCustomerName(materialSubOrderVO.getCustomerName());
			
			materialPaymentPO.setReferMoney(materialSubOrderVO.getRefund());
			materialPaymentPO.setPaymentType(MaterialPaymentPO.PAYMENTTYPE_TYPE_REJECT_INT);
			
			materialPaymentDao.save(materialPaymentPO);
			
			materialSubOrderRefundPO.setMpId(materialPaymentPO.getMpId());
			
			float refundMoney = 0;
			
			materialSubOrderPO = materialSubOrderDao.get(msoId);
			if(materialSubOrderPO != null){
				if(materialSubOrderPO.getBalanceStatus() == MaterialSubOrderPO.BALANCE_STATUS_TYPE_PRE_INT){
					
					if(materialSubOrderItemPO.getCalcType() == MaterialSubOrderItemPO.CALCTYPE_TYPE_BASE_INT){
						// 利润 : (售价 - 预结算底价) * 数量 , 成本 : 预结算底价 * 数量
						refundMoney = Arith.sub(refundMoney, Arith.mul(Arith.sub(materialSubOrderItemPO.getPrice(), materialSubOrderItemPO.getPrePoint()), materialSubOrderItemVO.getNum()));
					}else if(materialSubOrderItemPO.getCalcType() == MaterialSubOrderItemPO.CALCTYPE_TYPE_POINT_INT){
						// 利润 : (售价 - 折扣价 * (1 - 预结算点位)) * 数量 , 成本 : 折扣价 * (1 - 预结算点位) * 数量
						refundMoney = Arith.sub(refundMoney, Arith.mul(Arith.mul(materialSubOrderItemPO.getPrice(), materialSubOrderItemPO.getPrePoint()), materialSubOrderItemVO.getNum()));
					}
					
					MaterialSubOrderPreBalancePO materialSubOrderPreBalancePO = new MaterialSubOrderPreBalancePO();
					materialSubOrderPreBalancePO.setMsoId(materialSubOrderPO.getMsoId());
					materialSubOrderPreBalancePO.setMsoNo(materialSubOrderPO.getMsoNo());
					materialSubOrderPreBalancePO.setUserId(userId);
					materialSubOrderPreBalancePO.setUserName(userName);
					materialSubOrderPreBalancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
					materialSubOrderPreBalancePO.setPreBalance(refundMoney);
					
					materialSubOrderPreBalanceDao.save(materialSubOrderPreBalancePO);
				}else if(materialSubOrderPO.getBalanceStatus() == MaterialSubOrderPO.BALANCE_STATUS_TYPE_POST_INT){
					
					if(materialSubOrderItemPO.getCalcType() == MaterialSubOrderItemPO.CALCTYPE_TYPE_BASE_INT){
						// 利润 : (售价 - 结算底价) * 数量 , 成本 : 结算底价 * 数量
						refundMoney = Arith.mul(Arith.sub(materialSubOrderItemPO.getPrice(), materialSubOrderItemPO.getPostPoint()), materialSubOrderItemVO.getNum());
					}else if(materialSubOrderItemPO.getCalcType() == MaterialSubOrderItemPO.CALCTYPE_TYPE_POINT_INT){
						// 利润 : (售价 - 折扣价 * (1 - 结算点位)) * 数量 , 成本 : 折扣价 * (1 - 结算点位) * 数量
						refundMoney = Arith.mul(Arith.mul(materialSubOrderItemPO.getPrice(), materialSubOrderItemPO.getPostPoint()), materialSubOrderItemVO.getNum());
					}
					
					MaterialSubOrderPostBalancePO materialSubOrderPostBalancePO = new MaterialSubOrderPostBalancePO();
					materialSubOrderPostBalancePO.setMsoId(materialSubOrderPO.getMsoId());
					materialSubOrderPostBalancePO.setMsoNo(materialSubOrderPO.getMsoNo());
					materialSubOrderPostBalancePO.setUserId(userId);
					materialSubOrderPostBalancePO.setUserName(userName);
					materialSubOrderPostBalancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
					materialSubOrderPostBalancePO.setPostBalance(refundMoney);
					
					materialSubOrderPostBalanceDao.save(materialSubOrderPostBalancePO);
				}
				
				materialSubOrderRefundDao.saveOrUpdate(materialSubOrderRefundPO);
				
				int itemNum = materialSubOrderItemDao.queryMaterialSubOrderItemByMsoId(msoId).size();
				if(itemNum == 0 && materialSubOrderPO != null){
					materialSubOrderPO.setStatus(MaterialSubOrderPO.STATUS_TYPE_REFUND_INT);
					redirect = 1;
				}
				
				materialSubOrderPO.setProfit(Arith.add(materialSubOrderPO.getProfit(), refundMoney));
				materialSubOrderDao.update(materialSubOrderPO);
			}
		}
		
		return redirect;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refundMaterialSubOrderItemForPackage(MaterialSubOrderVO materialSubOrderVO, List<MaterialSubOrderItemVO> materialSubOrderItemVOs, long msoId, String userId, String userName){
		
		int redirect = 0;
		
		MaterialSubOrderPO materialSubOrderPO = null;
		
		int ident = new Random().nextInt(9999);
		float refundTotal = 0;
		float prePoint = 0;
		float postPoint = 0;
		int balanceType = 0;
		
		String materialTypeName = "";
		String materialBrandName = "";
		
		List<MaterialSubOrderRefundPO> materialSubOrderRefundPOs = new ArrayList<MaterialSubOrderRefundPO>();
		
		MaterialPaymentPO materialPaymentPO = new MaterialPaymentPO();
		
		materialPaymentPO.setMsoId(msoId);
		materialPaymentPO.setMsoNo(materialSubOrderVO.getMsoNo());
		
		materialPaymentPO.setMaterialType("");
		materialPaymentPO.setMaterialBrand("");
		
		UserPO userPO = userDao.get(userId);
		if(userPO != null){
			materialPaymentPO.setCreateUserId(userPO.getUserId());
			materialPaymentPO.setCreateUserName(userPO.getCurrentName());
		}else{
			materialPaymentPO.setCreateUserId("");
			materialPaymentPO.setCreateUserName("");
		}
		
		materialPaymentPO.setCustomerId(materialSubOrderVO.getCustomerId());
		materialPaymentPO.setCustomerName(materialSubOrderVO.getCustomerName());
		
		materialPaymentPO.setPaymentType(MaterialPaymentPO.PAYMENTTYPE_TYPE_REJECT_INT);
		
		materialPaymentDao.save(materialPaymentPO);
		
		for(MaterialSubOrderItemVO materialSubOrderItemVO: materialSubOrderItemVOs){
			
			MaterialSubOrderItemPO materialSubOrderItemPO = materialSubOrderItemDao.get(materialSubOrderItemVO.getMsoiId());
			
			materialBrandName = materialSubOrderItemPO.getMaterialBrandName();
			materialTypeName = materialSubOrderItemPO.getMaterialTypeName();
			
			if(materialSubOrderItemPO != null){
				
				MaterialSubOrderRefundPO materialSubOrderRefundPO = new MaterialSubOrderRefundPO();
				BeanUtil.copyProperties(materialSubOrderItemPO, materialSubOrderRefundPO);
				
				materialSubOrderRefundPO.setIdent(ident);
				materialSubOrderRefundPO.setNum(materialSubOrderItemVO.getNum());
				materialSubOrderRefundPO.setTotal(materialSubOrderItemVO.getTotal());
				materialSubOrderRefundPO.setStatus(MaterialSubOrderRefundPO.STATUS_TYPE_REFUND_INT);
				materialSubOrderRefundPO.setBalanceType(materialSubOrderItemPO.getBalanceStatus());
				materialSubOrderRefundPO.setRefundDes(materialSubOrderVO.getRefundDes());
				materialSubOrderRefundPO.setMpId(materialPaymentPO.getMpId());
				
				materialSubOrderRefundPOs.add(materialSubOrderRefundPO);
				
				balanceType = materialSubOrderItemPO.getBalanceStatus();
				if(balanceType == MaterialSubOrderPO.BALANCE_STATUS_TYPE_PRE_INT){
					prePoint = materialSubOrderItemPO.getPrePoint();
				}else if(balanceType == MaterialSubOrderPO.BALANCE_STATUS_TYPE_POST_INT){
					postPoint = materialSubOrderItemPO.getPostPoint();
				}
				
				refundTotal = materialSubOrderItemVO.getTotal();
			}
		}
		
		materialPaymentPO.setMaterialType(materialTypeName);
		materialPaymentPO.setMaterialBrand(materialBrandName);
		materialPaymentPO.setReferMoney(materialSubOrderVO.getRefund());
		materialPaymentDao.saveOrUpdate(materialPaymentPO);
		
		materialSubOrderPO = materialSubOrderDao.get(msoId);
		
		float refundMoney = 0;
		
		float materialDesignerSalaryScale = Float.valueOf(SystemConfig.getFloat("materialDesignerSalaryScale", 0.5f));
		
		if(materialSubOrderPO != null){
			if(materialSubOrderPO != null && balanceType == MaterialSubOrderPO.BALANCE_STATUS_TYPE_PRE_INT){
				// 利润 : 退款总价 * 预结算点位 * 0.5 , 成本 : 退款总价 * (1 - 预结算点位)
				refundMoney = Arith.sub(refundMoney, Arith.mul(refundTotal, prePoint));
			}else if(materialSubOrderPO != null && materialSubOrderPO.getBalanceStatus() == MaterialSubOrderPO.BALANCE_STATUS_TYPE_POST_INT){
				// 利润 : 退款总价 * 结算点位 * 0.5 , 成本 : 退款总价 * (1 - 结算点位)
				refundMoney = Arith.sub(refundMoney, Arith.mul(Arith.mul(refundTotal, postPoint), materialDesignerSalaryScale));
			}
			
			MaterialSubOrderPostBalancePO materialSubOrderPostBalancePO = new MaterialSubOrderPostBalancePO();
			materialSubOrderPostBalancePO.setMsoId(materialSubOrderPO.getMsoId());
			materialSubOrderPostBalancePO.setMsoNo(materialSubOrderPO.getMsoNo());
			materialSubOrderPostBalancePO.setUserId(userId);
			materialSubOrderPostBalancePO.setUserName(userName);
			materialSubOrderPostBalancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			materialSubOrderPostBalancePO.setPostBalance(refundMoney);
			
			materialSubOrderPostBalanceDao.save(materialSubOrderPostBalancePO);
			
			int itemNum = materialSubOrderItemDao.queryMaterialSubOrderItemByMsoId(msoId).size();
			if(materialSubOrderPO != null && itemNum == 0){
				materialSubOrderPO.setStatus(MaterialSubOrderPO.STATUS_TYPE_REFUND_INT);
				redirect = 1;
			}
			
			materialSubOrderPO.setProfit(Arith.add(materialSubOrderPO.getProfit(), refundMoney));
			materialSubOrderDao.update(materialSubOrderPO);
		}
		
		return redirect;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int changeMaterialSubOrderItemForCaclType(MaterialSubOrderItemVO materialSubOrderItemVO, String userId) throws FLException{
		
		MaterialSubOrderItemPO materialSubOrderItemPO = materialSubOrderItemDao.get(materialSubOrderItemVO.getMsoiId());
		
		if(materialSubOrderItemPO != null){
			int caclType = materialSubOrderItemPO.getCalcType();
			
			if(materialSubOrderItemPO.getBalanceStatus() != MaterialSubOrderItemPO.BALANCESTATUS_TYPE_INIT_INT){
				throw new FLException(180009, "操作型号不能修改结算方式");
			}
			
			if(!"".equals(materialSubOrderItemPO.getPackageName())){
				throw new FLException(180010, "套餐不能修改结算方式");
			}
			
			if(caclType == MaterialSubOrderItemPO.CALCTYPE_TYPE_BASE_INT){
				materialSubOrderItemPO.setCalcType(MaterialSubOrderItemPO.CALCTYPE_TYPE_POINT_INT);
			}else if(caclType == MaterialSubOrderItemPO.CALCTYPE_TYPE_POINT_INT){
				materialSubOrderItemPO.setCalcType(MaterialSubOrderItemPO.CALCTYPE_TYPE_BASE_INT);
			}
			
			materialSubOrderItemPO.setPrePoint(0);
			
			materialSubOrderItemDao.update(materialSubOrderItemPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int deleteMaterialSubOrderItem(List<Long> msoiIds, long msoId) throws FLException{
		
		int redirect = 0;
		float _deleteTotal = 0;
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderDao.get(msoId);
		MaterialSubOrderItemPO materialSubOrderItemPO = null;
		List<String> materialSubOrderItemPackageNames = new ArrayList<String>();
		
		if(materialSubOrderPO == null){
			throw new FLException(180001, "主材订单不存在");
		}
		
		if(materialSubOrderPO.getFullStatus() != MaterialSubOrderPO.FINANCE_STATUS_TYPE_INIT_INT){
			throw new FLException(180011, "主材订单当前状态不能删除型号");
		}
		
		if(msoiIds != null){
			for(Long msoiId: msoiIds){
				
				if(msoiId == null) continue;
				
				materialSubOrderItemPO = materialSubOrderItemDao.get(msoiId);
				if(materialSubOrderItemPO != null){
					String packageName = materialSubOrderItemPO.getPackageName();
					
					if(!"".equals(packageName)){
						if(!materialSubOrderItemPackageNames.contains(packageName)){
							_deleteTotal = Arith.add(_deleteTotal, materialSubOrderItemPO.getTotal());
							materialSubOrderItemPackageNames.add(packageName);
						}
					}else{
						_deleteTotal = Arith.add(_deleteTotal, materialSubOrderItemPO.getTotal());
					}
					
					materialSubOrderItemPO.setStatus(MaterialSubOrderItemPO.STATUS_TYPE_DELETE_INT);
					materialSubOrderItemPO.setNum(0);
					materialSubOrderItemPO.setTotal(0);
				}
			}
			
			float total = Arith.sub(materialSubOrderPO.getTotal(), _deleteTotal);
			
			materialSubOrderPO.setTotal(total > 0 ? total : 0);
			
			materialSubOrderDao.update(materialSubOrderPO);
		}
		
		return redirect;
	}
	
	public static float packageMaterialSubOrderItem(MaterialSubOrderPO materialSubOrderPO, List<MaterialSubOrderItemVO> materialSubOrderItemVOs, Map<String, List<MaterialSubOrderItemPO>> packageItems){
		
		float total = 0;
		int fullFlag = 0;
		
		long msoId = materialSubOrderPO.getMsoId();
		int msoType = materialSubOrderPO.getMsoType();
		
		for(MaterialSubOrderItemVO materialSubOrderItemVO: materialSubOrderItemVOs){
			MaterialSubOrderItemPO materialSubOrderItemPO = new MaterialSubOrderItemPO();
			BeanUtil.copyProperties(materialSubOrderItemVO, materialSubOrderItemPO);
			
			materialSubOrderItemPO.setRawCalcType(materialSubOrderItemVO.getCalcType());
			materialSubOrderItemPO.setRawPoint(materialSubOrderItemVO.getPrePoint());
			
			if(materialSubOrderItemPO.getSalePrice() != materialSubOrderItemPO.getPrice()){
				fullFlag = 1;
			}
			
			materialSubOrderItemPO.setMsoId(msoId);
			
			total = Arith.add(total, materialSubOrderItemPO.getTotal());
			
			if(!"".equals(materialSubOrderItemVO.getPackageName())){
				
				String packageName = materialSubOrderItemVO.getPackageName();
				
				materialSubOrderItemPO.setCalcType(MaterialSubOrderItemPO.CALCTYPE_TYPE_POINT_INT);
				materialSubOrderItemPO.setPrePoint(0);
				
				if(packageItems.containsKey(packageName)){
					List<MaterialSubOrderItemPO> tmpItems = packageItems.get(packageName);
					float tmpTotal = Arith.add(tmpItems.get(0).getTotal(), materialSubOrderItemPO.getTotal());
					tmpItems.add(materialSubOrderItemPO);
					
					for(MaterialSubOrderItemPO item: tmpItems){
						item.setTotal(tmpTotal);
					}
				}else{
					List<MaterialSubOrderItemPO> tmpItems = new ArrayList<MaterialSubOrderItemPO>();
					tmpItems.add(materialSubOrderItemPO);
					packageItems.put(packageName, tmpItems);
				}
				
				materialSubOrderPO.setPackageFlag(1);
			}else{
				
				if(msoType == MaterialSubOrderPO.MSO_TYPE_INSIDE_INT){
					materialSubOrderItemPO.setCalcType(MaterialSubOrderItemPO.CALCTYPE_TYPE_POINT_INT);
					materialSubOrderItemPO.setPrePoint(0);
				}
				
				if(packageItems.containsKey("")){
					List<MaterialSubOrderItemPO> tmpItems = packageItems.get("");
					tmpItems.add(materialSubOrderItemPO);
				}else{
					List<MaterialSubOrderItemPO> tmpItems = new ArrayList<MaterialSubOrderItemPO>();
					tmpItems.add(materialSubOrderItemPO);
					packageItems.put("", tmpItems);
				}
			}
		}
		
		if(fullFlag != 0 && (materialSubOrderPO.getOtherStatus() & MaterialSubOrderPO.OTHER_STATUS_FULL_PAYMENT_INT) != 1){
			materialSubOrderPO.setOtherStatus(materialSubOrderPO.getOtherStatus() + MaterialSubOrderPO.OTHER_STATUS_FULL_PAYMENT_INT);
		}
		
		return total;
	}
	
}
