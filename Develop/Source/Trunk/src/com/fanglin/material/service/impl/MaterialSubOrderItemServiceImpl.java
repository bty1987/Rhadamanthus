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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.material.dao.MaterialSubOrderDao;
import com.fanglin.material.dao.MaterialSubOrderItemDao;
import com.fanglin.material.po.MaterialSubOrderItemPO;
import com.fanglin.material.po.MaterialSubOrderPO;
import com.fanglin.material.service.MaterialSubOrderItemService;
import com.fanglin.material.vo.MaterialSubOrderItemVO;
import com.fanglin.material.vo.MaterialSubOrderVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;

@Service("materialSubOrderItemService")
@Transactional(readOnly=true)
public class MaterialSubOrderItemServiceImpl implements MaterialSubOrderItemService {
	
	public static final int MATERIAL_LIMIT_INT = 10;
	
	@Autowired
	private MaterialSubOrderDao materialSubOrderDao;
	
	@Autowired
	private MaterialSubOrderItemDao materialSubOrderItemDao;
	
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
	public List<MaterialSubOrderItemVO> queryMaterialSubOrderItemByMsoId(MaterialSubOrderItemVO materialSubOrderItemVO){
		
		List<MaterialSubOrderItemPO> materialSubOrderItemPOs = materialSubOrderItemDao.queryMaterialSubOrderItemByMsoId(materialSubOrderItemVO.getMsoId());
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
		float discountTotal = 0;
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
		discountTotal = Arith.add(materialSubOrderPO.getDistotal(),discountTotal);
		
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
			float _discountTotal = setDisCountTotal(materialSubOrderPO, materialSubOrderItemVOs);
			total = Arith.add(total, _total);
			discountTotal = Arith.add(_discountTotal,discountTotal);
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
		materialSubOrderPO.setDistotal(discountTotal);
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
					materialSubOrderItemVO.setTotal(0f);
					materialSubOrderItemVO.setPrePoint(0f);
					materialSubOrderItemVO.setPostPoint(0f);
					
					packageFlagMap.put(packageName, materialSubOrderItemPackage);
					
					packageItemsList = new ArrayList<MaterialSubOrderItemVO>();
					packageItemsList.add(materialSubOrderItemVO);
					
					packageItemsMap.put(packageName, packageItemsList);
					
				}else{
					packageItemsList = packageItemsMap.get(packageName);
					
					materialSubOrderItemPackage = packageFlagMap.get(packageName);
					materialSubOrderItemVO.setLevel(1);
					materialSubOrderItemVO.setTotal(0f);
					materialSubOrderItemVO.setPrePoint(0f);
					materialSubOrderItemVO.setPostPoint(0f);
					
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
		float discountTotal = 0;
		if(materialSubOrderItemPO != null && materialSubOrderItemPO.getStatus() == MaterialSubOrderItemPO.STATUS_TYPE_INIT_INT && materialSubOrderItemPO.getBalanceStatus() == MaterialSubOrderItemPO.BALANCESTATUS_TYPE_INIT_INT){
			originalTotal = materialSubOrderItemPO.getTotal();
			materialSubOrderItemPO.setMaterialModelNo(materialSubOrderItemVO.getMaterialModelNo());
			materialSubOrderItemPO.setMaterialBrandName(materialSubOrderItemVO.getMaterialBrandName());
			materialSubOrderItemPO.setMaterialModelName(materialSubOrderItemVO.getMaterialModelName());
			materialSubOrderItemPO.setMaterialTypeName(materialSubOrderItemVO.getMaterialTypeName());
			materialSubOrderItemPO.setMeasurementUnitName(materialSubOrderItemVO.getMeasurementUnitName());
			discountTotal = Arith.mul(Arith.sub(materialSubOrderItemVO.getNum(), materialSubOrderItemPO.getNum()), materialSubOrderItemPO.getSalePrice());
			materialSubOrderItemPO.setNum(materialSubOrderItemVO.getNum());
			materialSubOrderItemPO.setTotal(materialSubOrderItemVO.getTotal());
			materialSubOrderItemDao.update(materialSubOrderItemPO);
			materialSubOrderPO.setTotal(Arith.add(Arith.sub(materialSubOrderItemVO.getTotal(), originalTotal), materialSubOrderPO.getTotal()));
			materialSubOrderPO.setDistotal(Arith.add(materialSubOrderPO.getDistotal(),discountTotal));
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
		float originalDiscountTotal = 0;
		float discountTotal = 0;
		for(MaterialSubOrderItemVO materialSubOrderItemVO: materialSubOrderItemVOs){
			MaterialSubOrderItemPO materialSubOrderItemPO = materialSubOrderItemDao.get(materialSubOrderItemVO.getMsoiId());
			
			if(materialSubOrderItemPO != null && materialSubOrderItemPO.getStatus() == MaterialSubOrderItemPO.STATUS_TYPE_INIT_INT && materialSubOrderItemPO.getBalanceStatus() == MaterialSubOrderItemPO.BALANCESTATUS_TYPE_INIT_INT){
				originalTotal = materialSubOrderItemPO.getTotal();
				total = materialSubOrderItemVO.getTotal();
				originalDiscountTotal = materialSubOrderPO.getDistotal();
				materialSubOrderItemPO.setMaterialModelNo(materialSubOrderItemVO.getMaterialModelNo());
				materialSubOrderItemPO.setMaterialBrandName(materialSubOrderItemVO.getMaterialBrandName());
				materialSubOrderItemPO.setMaterialModelName(materialSubOrderItemVO.getMaterialModelName());
				materialSubOrderItemPO.setMaterialTypeName(materialSubOrderItemVO.getMaterialTypeName());
				materialSubOrderItemPO.setMeasurementUnitName(materialSubOrderItemVO.getMeasurementUnitName());
				materialSubOrderItemPO.setPackageName(materialSubOrderItemVO.getPackageName());
				materialSubOrderItemPO.setTotal(materialSubOrderItemVO.getTotal());
				materialSubOrderItemPO.setDes(materialSubOrderItemVO.getDes());
				materialSubOrderItemDao.update(materialSubOrderItemPO);
				discountTotal = Arith.mul(materialSubOrderItemPO.getSalePrice(),Arith.sub(materialSubOrderItemVO.getNum(), materialSubOrderItemPO.getNum()));
				materialSubOrderPO.setDistotal(Arith.add(originalDiscountTotal,discountTotal));
				materialSubOrderItemPO.setNum(materialSubOrderItemVO.getNum());
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
			
			if(materialSubOrderItemPO != null && materialSubOrderItemPO.getBalanceStatus() == MaterialSubOrderItemPO.BALANCESTATUS_TYPE_PREBALANCE_INT){
				materialSubOrderItemPO.setPostPoint(materialSubOrderItemVO.getPostPoint());
				
				materialSubOrderItemDao.update(materialSubOrderItemPO);
			}
		}
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
		float _deleteDiscountTotal = 0;
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
							_deleteDiscountTotal = Arith.add(_deleteDiscountTotal, Arith.mul(materialSubOrderItemPO.getNum(), materialSubOrderItemPO.getSalePrice()));
							materialSubOrderItemPackageNames.add(packageName);
						}else{
							_deleteDiscountTotal = Arith.add(_deleteDiscountTotal, Arith.mul(materialSubOrderItemPO.getNum(), materialSubOrderItemPO.getSalePrice()));
						}
					}else{
						_deleteTotal = Arith.add(_deleteTotal, materialSubOrderItemPO.getTotal());
						_deleteDiscountTotal = Arith.add(_deleteDiscountTotal, Arith.mul(materialSubOrderItemPO.getNum(), materialSubOrderItemPO.getSalePrice()));
						
					}
					
					materialSubOrderItemPO.setStatus(MaterialSubOrderItemPO.STATUS_TYPE_DELETE_INT);
					materialSubOrderItemPO.setNum(0);
					materialSubOrderItemPO.setTotal(0);
				}
			}
			
			float total = Arith.sub(materialSubOrderPO.getTotal(), _deleteTotal);
			float discountTotal = Arith.sub(materialSubOrderPO.getDistotal(), _deleteDiscountTotal);
			
			materialSubOrderPO.setTotal(total > 0 ? total : 0);
			materialSubOrderPO.setDistotal(discountTotal > 0 ? discountTotal : 0);
			
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
	
	public static float setDisCountTotal(MaterialSubOrderPO materialSubOrderPO, List<MaterialSubOrderItemVO> materialSubOrderItemVOs){
		float discountTotal = 0;
		for(MaterialSubOrderItemVO materialSubOrderItemVO: materialSubOrderItemVOs){
			discountTotal = Arith.add(discountTotal,Arith.mul(materialSubOrderItemVO.getNum(), materialSubOrderItemVO.getSalePrice()));
		}
		return discountTotal;
	}
	
}
