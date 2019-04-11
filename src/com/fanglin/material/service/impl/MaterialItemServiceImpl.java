/**
 * @File Name		: MaterialItemServiceImpl.java
 * @Package   	: com.fanglin.service.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Commentcribing	: 
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
import com.fanglin.material.dao.MaterialDao;
import com.fanglin.material.dao.MaterialItemDao;
import com.fanglin.material.po.MaterialItemPO;
import com.fanglin.material.po.MaterialPO;
import com.fanglin.material.service.MaterialItemService;
import com.fanglin.material.vo.MaterialItemVO;
import com.fanglin.material.vo.MaterialVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;

@Service("materialItemService")
@Transactional(readOnly = true)
public class MaterialItemServiceImpl implements MaterialItemService {

	public static final int MATERIAL_LIMIT_INT = 10;

	@Autowired
	private MaterialDao materialDao;

	@Autowired
	private MaterialItemDao materialItemDao;

	@Override
	public List<MaterialItemVO> queryMaterialItemByMid(MaterialItemVO materialItemVO) {

		List<MaterialItemPO> materialItemPOs = materialItemDao.queryMaterialItemByMid(materialItemVO.getMid());
		List<MaterialItemVO> materialItemVOs = packageMaterialItems(materialItemPOs);

		return materialItemVOs;
	}

	@Override
	public MaterialItemVO queryMaterialItemByMiid(MaterialItemVO materialItemVO) {

		MaterialItemPO materialItemPO = materialItemDao.queryMaterialItemByMiid(materialItemVO.getMiid());

		BeanUtil.copyProperties(materialItemPO, materialItemVO, "miid");

		materialItemVO.setPrePoint(materialItemPO.getRawPoint());
		materialItemVO.setCalcType(materialItemPO.getRawCalcType());

		if (materialItemPO.getRawCalcType() == MaterialItemPO.CALCTYPE_TYPE_BASE_INT) {
			materialItemVO.setBase(materialItemPO.getRawPoint());
		} else if (materialItemPO.getRawCalcType() == MaterialItemPO.CALCTYPE_TYPE_POINT_INT) {
			materialItemVO.setPoint(materialItemPO.getRawPoint());
		}

		return materialItemVO;
	}

	@Override
	public List<MaterialItemVO> queryMaterialItemForNameByName(MaterialItemVO materialItemVO) {

		List<MaterialItemPO> materialItemPOs = materialItemDao.queryMaterialItemByName(materialItemVO.getMid(), materialItemVO.getName(), MATERIAL_LIMIT_INT);
		List<MaterialItemVO> materialItemVOs = new ArrayList<MaterialItemVO>();

		for (MaterialItemPO materialItemPO : materialItemPOs) {
			materialItemVO = new MaterialItemVO();
			BeanUtil.copyProperties(materialItemPO, materialItemVO);

			materialItemVOs.add(materialItemVO);
		}

		return materialItemVOs;
	}

	@Override
	public List<MaterialItemVO> queryMaterialItemForNameByNo(MaterialItemVO materialItemVO) {

		List<MaterialItemPO> materialItemPOs = materialItemDao.queryMaterialItemByNo(materialItemVO.getMid(), materialItemVO.getName(), MATERIAL_LIMIT_INT);
		List<MaterialItemVO> materialItemVOs = new ArrayList<MaterialItemVO>();

		for (MaterialItemPO materialItemPO : materialItemPOs) {
			materialItemVO = new MaterialItemVO();
			BeanUtil.copyProperties(materialItemPO, materialItemVO);

			materialItemVOs.add(materialItemVO);
		}

		return materialItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addMaterialItem(MaterialVO materialVO, List<MaterialItemVO> materialItemVOs) throws FLException {

		MaterialPO materialPO = materialDao.get(materialVO.getMid());

		float total = 0;
		float discountTotal = 0;
		
		Map<String, List<MaterialItemPO>> packageItems = new HashMap<String, List<MaterialItemPO>>();
		Map<String, List<MaterialItemPO>> originalPackageItems = new HashMap<String, List<MaterialItemPO>>();

		if (materialPO == null) {
			throw new FLException(180001, "主材单不存在");
		}
		
		if (materialPO.getStatus() != MaterialPO.STATUS_TYPE_INIT_INT) {
			throw new FLException(180025, "主材单不可操作");
		}

		if (materialPO.getFullStatus() != MaterialPO.FINANCE_STATUS_TYPE_INIT_INT) {
			throw new FLException(180025, "主材单不可操作");
		}

		if (materialItemVOs == null) {
			throw new FLException(180016, "主材单添加型号不存在");
		}

		total = Arith.add(materialPO.getTotal(), total);
		discountTotal = Arith.add(materialPO.getDistotal(), discountTotal);

		List<MaterialItemPO> materialItemPOs = materialItemDao.queryMaterialItemByMidNotRefund(materialVO.getMid());

		for (MaterialItemPO materialItemPO : materialItemPOs) {

			String packageName = materialItemPO.getPackageName();

			if (!"".equals(packageName)) {
				if (originalPackageItems.containsKey(packageName)) {
					originalPackageItems.get(packageName).add(materialItemPO);
				} else {
					List<MaterialItemPO> _materialItemPOs = new ArrayList<MaterialItemPO>();
					_materialItemPOs.add(materialItemPO);
					originalPackageItems.put(packageName, _materialItemPOs);
				}
			}
		}

		if (materialItemVOs != null) {

			float _total = packageMaterialItem(materialPO, materialItemVOs, packageItems);
			float _discountTotal = setDisCountTotal(materialPO, materialItemVOs);
			total = Arith.add(total, _total);
			discountTotal = Arith.add(_discountTotal, discountTotal);
			for (String packageName : packageItems.keySet()) {

				float tmpTotal = 0;
				List<MaterialItemPO> tmpItems = packageItems.get(packageName);

				if (originalPackageItems.containsKey(packageName)) {

					tmpTotal = tmpItems.get(0).getTotal();
					float _tmpTotal = tmpItems.get(0).getTotal();
					List<MaterialItemPO> tmpOriginalItems = originalPackageItems.get(packageName);

					for (MaterialItemPO materialItemPO : tmpOriginalItems) {

						tmpTotal = materialItemPO.getTotal();

						materialItemPO.setTotal(Arith.add(materialItemPO.getTotal(), _tmpTotal));
						materialItemDao.save(materialItemPO);
					}

				}

				for (MaterialItemPO materialItemPO : tmpItems) {
					materialItemPO.setTotal(Arith.add(materialItemPO.getTotal(), tmpTotal));

					materialItemDao.save(materialItemPO);
				}
			}
		}

		materialPO.setDistotal(discountTotal);
		materialPO.setTotal(Arith.round(total, 2));
		materialDao.save(materialPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateMaterialItemForModel(MaterialVO materialVO, MaterialItemVO materialItemVO) throws FLException {

		MaterialPO materialPO = materialDao.get(materialVO.getMid());

		if (materialPO == null) {
			throw new FLException(180001, "主材单不存在");
		}
		
		if (materialPO.getStatus() != MaterialPO.STATUS_TYPE_INIT_INT) {
			throw new FLException(180025, "主材单不可操作");
		}

		if (materialPO.getFullStatus() != MaterialPO.FINANCE_STATUS_TYPE_INIT_INT) {
			throw new FLException(180025, "主材单不可操作");
		}

		MaterialItemPO materialItemPO = materialItemDao.get(materialItemVO.getMiid());
		
		if(materialItemPO == null){
			throw new FLException(180022, "主材项不存在");
		}
		
		if(materialItemPO.getStatus() != MaterialItemPO.STATUS_TYPE_INIT_INT){
			throw new FLException(180022, "主材项不存在");
		}

		float originalTotal = 0;
		float discountTotal = 0;
		
		originalTotal = materialItemPO.getTotal();
		discountTotal = Arith.mul(Arith.sub(materialItemVO.getNum(), materialItemPO.getNum()), materialItemPO.getSalePrice());
		
		materialItemPO.setNum(materialItemVO.getNum());
		materialItemPO.setTotal(materialItemVO.getTotal());
		
		materialItemDao.update(materialItemPO);
		
		materialPO.setTotal(Arith.add(Arith.sub(materialItemVO.getTotal(), originalTotal), materialPO.getTotal()));
		materialPO.setDistotal(Arith.add(materialPO.getDistotal(), discountTotal));
		
		materialDao.update(materialPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateMaterialItemForPackage(MaterialVO materialVO, List<MaterialItemVO> materialItemVOs) throws FLException {

		MaterialPO materialPO = materialDao.get(materialVO.getMid());

		if (materialPO == null) {
			throw new FLException(180001, "主材单不存在");
		}
		
		if (materialPO.getStatus() != MaterialPO.STATUS_TYPE_INIT_INT) {
			throw new FLException(180025, "主材单不可操作");
		}

		if (materialPO.getFullStatus() != MaterialPO.FINANCE_STATUS_TYPE_INIT_INT) {
			throw new FLException(180025, "主材单不可操作");
		}

		float originalTotal = 0;
		float total = 0;
		float originalDiscountTotal = 0;
		float discountTotal = 0;
		
		for (MaterialItemVO materialItemVO : materialItemVOs) {
			
			MaterialItemPO materialItemPO = materialItemDao.get(materialItemVO.getMiid());
			
			if(materialItemPO == null){
				throw new FLException(180022, "主材项不存在");
			}
			
			if(materialItemPO.getStatus() != MaterialItemPO.STATUS_TYPE_INIT_INT){
				throw new FLException(180022, "主材项不存在");
			}

			originalTotal = materialItemPO.getTotal();
			total = materialItemVO.getTotal();
			originalDiscountTotal = materialPO.getDistotal();
			
			materialItemPO.setNum(materialItemVO.getNum());
			materialItemPO.setTotal(materialItemVO.getTotal());
			materialItemPO.setComment(materialItemVO.getComment());
			
			materialItemDao.update(materialItemPO);
			
			discountTotal = Arith.mul(materialItemPO.getSalePrice(), Arith.sub(materialItemVO.getNum(), materialItemPO.getNum()));
		}

		materialPO.setDistotal(Arith.add(originalDiscountTotal, discountTotal));
		materialPO.setTotal(Arith.add(Arith.sub(total, originalTotal), materialPO.getTotal()));
		
		materialDao.update(materialPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int changeMaterialItemForCaclType(MaterialItemVO materialItemVO, String userId) throws FLException {

		MaterialItemPO materialItemPO = materialItemDao.get(materialItemVO.getMiid());
		
		if(materialItemPO == null){
			throw new FLException(180022, "主材项不存在");
		}

		int caclType = materialItemPO.getCalcType();

		if (materialItemPO.getBalanceStatus() != MaterialItemPO.BALANCESTATUS_TYPE_INIT_INT) {
			throw new FLException(180009, "操作型号不能修改结算方式");
		}

		if (!"".equals(materialItemPO.getPackageName())) {
			throw new FLException(180010, "套餐不能修改结算方式");
		}

		if (caclType == MaterialItemPO.CALCTYPE_TYPE_BASE_INT) {
			materialItemPO.setCalcType(MaterialItemPO.CALCTYPE_TYPE_POINT_INT);
		} else if (caclType == MaterialItemPO.CALCTYPE_TYPE_POINT_INT) {
			materialItemPO.setCalcType(MaterialItemPO.CALCTYPE_TYPE_BASE_INT);
		}

		materialItemPO.setPrePoint(0f);

		materialItemDao.update(materialItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateMaterialItemForPrePT(List<Long> miids, MaterialItemVO materialItemVO) {

		for (Long miid : miids) {
			MaterialItemPO materialItemPO = materialItemDao.get(miid);
			if (materialItemPO != null && materialItemPO.getBalanceStatus() == MaterialItemPO.BALANCESTATUS_TYPE_INIT_INT) {
				materialItemPO.setPrePoint(materialItemVO.getPrePoint());

				materialItemDao.update(materialItemPO);
			}
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteMaterialItem(List<Long> miids, long mid) throws FLException {
		
		MaterialPO materialPO = materialDao.get(mid);
		
		if (materialPO == null) {
			throw new FLException(180001, "主材单不存在");
		}
		
		if (materialPO.getStatus() != MaterialPO.STATUS_TYPE_INIT_INT) {
			throw new FLException(180025, "主材单不可操作");
		}

		if (materialPO.getFullStatus() != MaterialPO.FINANCE_STATUS_TYPE_INIT_INT) {
			throw new FLException(180025, "主材单不可操作");
		}
		
		if (materialPO.getBalanceStatus() != MaterialPO.BALANCE_STATUS_TYPE_INIT_INT){
			throw new FLException(180025, "主材单不可操作");
		}

		int redirect = 0;
		float _deleteTotal = 0;
		float _deleteDiscountTotal = 0;
		
		MaterialItemPO materialItemPO = null;
		List<String> materialItemPackageNames = new ArrayList<String>();

		if (miids != null) {
			for (Long miid : miids) {

				if (miid == null)
					continue;

				materialItemPO = materialItemDao.get(miid);
				if (materialItemPO != null) {
					String packageName = materialItemPO.getPackageName();

					if (!"".equals(packageName)) {
						if (!materialItemPackageNames.contains(packageName)) {
							_deleteTotal = Arith.add(_deleteTotal, materialItemPO.getTotal());
							_deleteDiscountTotal = Arith.add(_deleteDiscountTotal, Arith.mul(materialItemPO.getNum(), materialItemPO.getSalePrice()));
							materialItemPackageNames.add(packageName);
						} else {
							_deleteDiscountTotal = Arith.add(_deleteDiscountTotal, Arith.mul(materialItemPO.getNum(), materialItemPO.getSalePrice()));
						}
					} else {
						_deleteTotal = Arith.add(_deleteTotal, materialItemPO.getTotal());
						_deleteDiscountTotal = Arith.add(_deleteDiscountTotal, Arith.mul(materialItemPO.getNum(), materialItemPO.getSalePrice()));

					}

					materialItemDao.delete(materialItemPO);
				}
			}

			float total = Arith.sub(materialPO.getTotal(), _deleteTotal);
			float discountTotal = Arith.sub(materialPO.getDistotal(), _deleteDiscountTotal);

			materialPO.setTotal(total > 0 ? total : 0);
			materialPO.setDistotal(discountTotal > 0 ? discountTotal : 0);

			materialDao.update(materialPO);
		}

		return redirect;
	}

	public static float packageMaterialItem(MaterialPO materialPO, List<MaterialItemVO> materialItemVOs, Map<String, List<MaterialItemPO>> packageItems) {

		float total = 0;
		short fullFlag = 0;
		long mid = materialPO.getMid();

		for (MaterialItemVO materialItemVO : materialItemVOs) {
			MaterialItemPO materialItemPO = new MaterialItemPO();
			BeanUtil.copyProperties(materialItemVO, materialItemPO);

			materialItemPO.setRawCalcType(materialItemVO.getCalcType());
			materialItemPO.setRawPoint(materialItemVO.getPrePoint());

			if (materialItemPO.getSalePrice() != materialItemPO.getPrice()) {
				fullFlag = 1;
			}

			materialItemPO.setMid(mid);

			total = Arith.add(total, materialItemPO.getTotal());

			if (!"".equals(materialItemVO.getPackageName())) {

				String packageName = materialItemVO.getPackageName();

				materialItemPO.setCalcType(MaterialItemPO.CALCTYPE_TYPE_POINT_INT);
				materialItemPO.setPrePoint(0f);

				if (packageItems.containsKey(packageName)) {
					List<MaterialItemPO> tmpItems = packageItems.get(packageName);
					float tmpTotal = Arith.add(tmpItems.get(0).getTotal(), materialItemPO.getTotal());
					tmpItems.add(materialItemPO);

					for (MaterialItemPO item : tmpItems) {
						item.setTotal(tmpTotal);
					}
				} else {
					List<MaterialItemPO> tmpItems = new ArrayList<MaterialItemPO>();
					tmpItems.add(materialItemPO);
					packageItems.put(packageName, tmpItems);
				}

				materialPO.setPackageFlag(MaterialPO.PACKAGE_ENABLE_INT);
			} else {

				if (packageItems.containsKey("")) {
					List<MaterialItemPO> tmpItems = packageItems.get("");
					tmpItems.add(materialItemPO);
				} else {
					List<MaterialItemPO> tmpItems = new ArrayList<MaterialItemPO>();
					tmpItems.add(materialItemPO);
					packageItems.put("", tmpItems);
				}
			}
		}

		if (fullFlag != 0 && (materialPO.getOtherStatus() & MaterialPO.OTHER_STATUS_FULL_PAYMENT_INT) != 1) {
			materialPO.setOtherStatus((short) (materialPO.getOtherStatus() + MaterialPO.OTHER_STATUS_FULL_PAYMENT_INT));
		}

		return total;
	}

	public static float setDisCountTotal(MaterialPO materialPO, List<MaterialItemVO> materialItemVOs) {
		float discountTotal = 0;
		for (MaterialItemVO materialItemVO : materialItemVOs) {
			discountTotal = Arith.add(discountTotal, Arith.mul(materialItemVO.getNum(), materialItemVO.getSalePrice()));
		}
		return discountTotal;
	}
	
	private List<MaterialItemVO> packageMaterialItems(List<MaterialItemPO> materialItemPOs) {

		List<MaterialItemVO> materialItemVOs = new ArrayList<MaterialItemVO>();

		Map<String, MaterialItemVO> packageFlagMap = new HashMap<String, MaterialItemVO>();
		Map<String, List<MaterialItemVO>> packageItemsMap = new HashMap<String, List<MaterialItemVO>>();

		List<MaterialItemVO> packageItemsList = null;

		int _id = 0;

		for (MaterialItemPO materialItemPO : materialItemPOs) {
			MaterialItemVO materialItemVO = new MaterialItemVO();
			BeanUtil.copyProperties(materialItemPO, materialItemVO);

			if (materialItemPO.getNum() == 0) {
				continue;
			}

			materialItemVO.setIsLeaf(true);
			materialItemVO.setExpanded(false);

			if (!materialItemPO.getPackageName().equals("")) {

				String packageName = materialItemPO.getPackageName();
				MaterialItemVO materialItemPackage = null;

				if (!packageFlagMap.containsKey(packageName)) {
					materialItemPackage = new MaterialItemVO();

					materialItemPackage.setCategory("-");
					materialItemPackage.setBrand("-");
					materialItemPackage.setMeasurementUnit("-");
					materialItemPackage.setComment("-");

					materialItemPackage.setNo(packageName);
					materialItemPackage.setName(packageName);
					materialItemPackage.setPackageName(packageName);
					materialItemPackage.setTotal(materialItemPO.getTotal());
					materialItemPackage.setMid(materialItemPO.getMid());

					materialItemPackage.setLevel(0);
					materialItemPackage.setIsLeaf(false);
					materialItemPackage.setParent(-1);
					materialItemPackage.setExpanded(true);

					materialItemPackage.setCalcType(MaterialItemPO.CALCTYPE_TYPE_POINT_INT);

					materialItemPackage.setPrePoint(materialItemPO.getPrePoint());
					materialItemPackage.setPostPoint(materialItemPO.getPostPoint());

					materialItemVO.setLevel(1);
					materialItemVO.setTotal(0f);
					materialItemVO.setPrePoint(0f);
					materialItemVO.setPostPoint(0f);

					packageFlagMap.put(packageName, materialItemPackage);

					packageItemsList = new ArrayList<MaterialItemVO>();
					packageItemsList.add(materialItemVO);

					packageItemsMap.put(packageName, packageItemsList);

				} else {
					packageItemsList = packageItemsMap.get(packageName);

					materialItemPackage = packageFlagMap.get(packageName);
					materialItemVO.setLevel(1);
					materialItemVO.setTotal(0f);
					materialItemVO.setPrePoint(0f);
					materialItemVO.setPostPoint(0f);

					packageItemsList.add(materialItemVO);
				}
			} else {
				if (materialItemVO.getNum() > 0) {
					materialItemVO.setId(++_id);
					materialItemVO.setLevel(0);
					materialItemVO.setParent(-1);
					materialItemVOs.add(materialItemVO);
				}
			}
		}

		for (String packageName : packageFlagMap.keySet()) {
			MaterialItemVO packageItem = packageFlagMap.get(packageName);

			if (packageItem.getTotal() > 0) {
				packageItem.setId(++_id);
				materialItemVOs.add(packageItem);

				packageItemsList = packageItemsMap.get(packageName);

				for (MaterialItemVO materialItemVO : packageItemsList) {
					materialItemVO.setId(++_id);
					materialItemVO.setParent(packageItem.getId());

					materialItemVOs.add(materialItemVO);
				}
			}
		}

		return materialItemVOs;
	}

}
