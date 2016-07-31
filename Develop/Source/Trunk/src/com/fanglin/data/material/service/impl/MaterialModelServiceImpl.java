/**
 * @File Name		: MaterialModelServiceImpl.java
 * @Package   	: com.fanglin.service.impl.material
 * @Version		: 1.0
 * @Date			: 2014-8-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.material.dao.MaterialBrandRightDao;
import com.fanglin.data.material.dao.MaterialModelDao;
import com.fanglin.data.material.service.MaterialModelService;
import com.fanglin.data.material.vo.MaterialModelVO;
import com.fanglin.data.po.BrandPO;
import com.fanglin.data.po.CategoryPO;
import com.fanglin.data.po.MaterialBrandRightPO;
import com.fanglin.data.po.MaterialModelPO;
import com.fanglin.data.po.MeasurementUnitPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("materialModelService")
@Transactional(readOnly=true)
public class MaterialModelServiceImpl implements MaterialModelService{
	
	public static final int MATERIAL_LIMIT_INT = 10;

	@Autowired
	private MaterialModelDao materialModelDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private MaterialBrandRightDao materialBrandRightDao;
	
	@Override
	public void pageMaterialModel(Paging paging, List<FilterVO> filters, String userId){
		
		UserPO userPO = userDao.get(userId);
		List<MaterialModelPO> materialModelPOs = null;
		List<Integer> brandIds = new ArrayList<Integer>();
		
		if("驻店导购".equals(userPO.getDuty())){
			
			MaterialBrandRightPO materialBrandRightPO = materialBrandRightDao.querymateriBrandRightByUserId(userPO.getUserId());
			
			if(!"".equals(materialBrandRightPO.getBrandId())){
				
				String _brandId = materialBrandRightPO.getBrandId();
				
				List<String> _brandIds = Arrays.asList(_brandId.substring(1, _brandId.length()-1).split("#"));
				
				for(String brandId: _brandIds){
					brandIds.add(Integer.parseInt(brandId));
				}
			}
			
			materialModelPOs = materialModelDao.queryPageMaterialModelByBrandIds(paging, filters, brandIds);
		}else{
			materialModelPOs = materialModelDao.queryPageMaterialModel(paging, filters);
		}
		
		List<MaterialModelVO> materialModelVOs = new ArrayList<MaterialModelVO>();
		
		for(MaterialModelPO materialModelPO: materialModelPOs){
			MaterialModelVO materialModelVO = new MaterialModelVO();
			BeanUtil.copyProperties(materialModelPO, materialModelVO);
			
			BrandPO brandPO = materialModelPO.getBrandPO();
			CategoryPO categoryPO = brandPO.getCategory();
			
			materialModelVO.setMaterialBrandId(brandPO.getBid());
			materialModelVO.setMaterialBrandName(brandPO.getBrandName());
			materialModelVO.setMeasurementUnitId(materialModelPO.getMeasurementUnitPO().getId());
			materialModelVO.setMeasurementUnitName(materialModelPO.getMeasurementUnitPO().getName());
			materialModelVO.setMaterialTypeId(categoryPO.getCid());
			materialModelVO.setMaterialTypeName(categoryPO.getCategoryName());
			
			materialModelVOs.add(materialModelVO);
		}
		
		paging.setData(materialModelVOs);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addMaterialModel(MaterialModelVO materialModelVO) throws FLException{
		
		MaterialModelPO materialModelPO = materialModelDao.queryMaterialModelByNoBrand(materialModelVO.getMaterialModelNo(), materialModelVO.getMaterialBrandId());
		
		if(materialModelPO != null){
			throw new FLException(180002, "型号信息已经存在");
		}
		
		materialModelPO = new MaterialModelPO();
		BeanUtil.copyProperties(materialModelVO, materialModelPO);
		
		materialModelPO.setBrandPO(new BrandPO(materialModelVO.getMaterialBrandId()));
		materialModelPO.setMeasurementUnitPO(new MeasurementUnitPO(materialModelVO.getMeasurementUnitId()));
		
		materialModelDao.saveOrUpdate(materialModelPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialModel(MaterialModelVO materialModelVO){
		
		MaterialModelPO materialModelPO = materialModelDao.get(materialModelVO.getMmId());
		
		if(materialModelPO != null){
			BeanUtil.copyProperties(materialModelVO, materialModelPO);
			materialModelPO.setBrandPO(new BrandPO(materialModelVO.getMaterialBrandId()));
			materialModelPO.setMeasurementUnitPO(new MeasurementUnitPO(materialModelVO.getMeasurementUnitId()));
			
			materialModelDao.saveOrUpdate(materialModelPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialModelForStatus(MaterialModelVO materialModelVO) {
		
		MaterialModelPO materialModelPO = materialModelDao.get(materialModelVO.getMmId());
		
		if(materialModelPO != null){
			
			materialModelPO.setStatus(materialModelVO.getStatus());
			
			materialModelDao.saveOrUpdate(materialModelPO);
		}
	}

	@Override
	public List<MaterialModelVO> queryMaterialModel(List<FilterVO> filters){
		
		List<MaterialModelPO> materialModelPOs = materialModelDao.queryMaterialModel(filters);
		List<MaterialModelVO> materialModelVOs = new ArrayList<MaterialModelVO>();
		
		for(MaterialModelPO materialModelPO: materialModelPOs){
			MaterialModelVO materialModelVO = new MaterialModelVO();
			BeanUtil.copyProperties(materialModelPO, materialModelVO);
			
			materialModelVO.setMaterialBrandId(materialModelPO.getBrandPO().getBid());
			materialModelVO.setMaterialBrandName(materialModelPO.getBrandPO().getBrandName());
			materialModelVO.setMeasurementUnitId(materialModelPO.getMeasurementUnitPO().getId());
			materialModelVO.setMeasurementUnitName(materialModelPO.getMeasurementUnitPO().getName());
			
			materialModelVOs.add(materialModelVO);
		}
		
		return materialModelVOs;
	}

	@Override
	public List<MaterialModelVO> queryMaterialModel(){
		
		List<MaterialModelPO> materialModelPOs = materialModelDao.list();
		List<MaterialModelVO> materialModelVOs = new ArrayList<MaterialModelVO>();
		
		for(MaterialModelPO materialModelPO: materialModelPOs){
			MaterialModelVO materialModelVO = new MaterialModelVO();
			BeanUtil.copyProperties(materialModelPO, materialModelVO);
			
			materialModelVO.setMaterialBrandId(materialModelPO.getBrandPO().getBid());
			materialModelVO.setMaterialBrandName(materialModelPO.getBrandPO().getBrandName());
			materialModelVO.setMeasurementUnitId(materialModelPO.getMeasurementUnitPO().getId());
			materialModelVO.setMeasurementUnitName(materialModelPO.getMeasurementUnitPO().getName());
			
			if(materialModelPO.getCalcType() == MaterialModelPO.CALC_TYPE_BASE_INT){
				materialModelVO.setCalcTypeName(MaterialModelPO.CALC_TYPE_BASE_STR);
				materialModelVO.setCalcValue(materialModelPO.getBase());
			}else if(materialModelPO.getCalcType() == MaterialModelPO.CALC_TYPE_POINT_INT){
				materialModelVO.setCalcTypeName(MaterialModelPO.CALC_TYPE_POINT_STR);
				materialModelVO.setCalcValue(materialModelPO.getPoint());
			}
			
			materialModelVOs.add(materialModelVO);
		}
		
		return materialModelVOs;
	}
	
	@Override
	public MaterialModelVO queryMaterialModelByMmId(int mmId){
		
		MaterialModelPO materialModelPO = materialModelDao.get(mmId);
		MaterialModelVO materialModelVO = new MaterialModelVO();
		
		BeanUtil.copyProperties(materialModelPO, materialModelVO);
		
		return materialModelVO;
	}

	@Override
	public MaterialModelVO queryMaterialModelByNo(MaterialModelVO materialModelVO){
		
		MaterialModelPO materialModelPO = materialModelDao.queryMaterialModelByNo(materialModelVO.getMaterialModelNo());
		BeanUtil.copyProperties(materialModelPO, materialModelVO);
		
		return materialModelVO;
	}

	@Override
	public List<MaterialModelVO> queryMaterialModelForAllByName(MaterialModelVO materialModelVO){
		
		List<MaterialModelPO> materialModelPOs = materialModelDao.queryMaterialModelByName(materialModelVO.getMaterialModelName(), MATERIAL_LIMIT_INT);
		List<MaterialModelVO> materialModelVOs = new ArrayList<MaterialModelVO>();
		
		for(MaterialModelPO materialModelPO: materialModelPOs){
			materialModelVO = new MaterialModelVO();
			BeanUtil.copyProperties(materialModelPO, materialModelVO);
			
			materialModelVO.setMaterialBrandId(materialModelPO.getBrandPO().getBid());
			materialModelVO.setMaterialBrandName(materialModelPO.getBrandPO().getBrandName());
			materialModelVO.setMeasurementUnitId(materialModelPO.getMeasurementUnitPO().getId());
			materialModelVO.setMeasurementUnitName(materialModelPO.getMeasurementUnitPO().getName());
			
			materialModelVOs.add(materialModelVO);
		}
		
		return materialModelVOs;
	}
	
	@Override
	public List<MaterialModelVO> queryMaterialModelForAllByNo(MaterialModelVO materialModelVO){
		
		List<MaterialModelPO> materialModelPOs = materialModelDao.queryMaterialModelByNo(materialModelVO.getMaterialModelNo(), MATERIAL_LIMIT_INT);
		List<MaterialModelVO> materialModelVOs = new ArrayList<MaterialModelVO>();
		
		for(MaterialModelPO materialModelPO: materialModelPOs){
			materialModelVO = new MaterialModelVO();
			BeanUtil.copyProperties(materialModelPO, materialModelVO);
			
			materialModelVO.setMaterialBrandId(materialModelPO.getBrandPO().getBid());
			materialModelVO.setMaterialBrandName(materialModelPO.getBrandPO().getBrandName());
			materialModelVO.setMeasurementUnitId(materialModelPO.getMeasurementUnitPO().getId());
			materialModelVO.setMeasurementUnitName(materialModelPO.getMeasurementUnitPO().getName());
			
			materialModelVOs.add(materialModelVO);
		}
		
		return materialModelVOs;
	}

	@Override
	public MaterialModelVO queryMaterialModelById(int materialModelId){
		
		MaterialModelPO materialModelPO = materialModelDao.get(materialModelId);
		MaterialModelVO materialModelVO = new MaterialModelVO();
		
		BeanUtil.copyProperties(materialModelPO, materialModelVO);
		
		materialModelVO.setMaterialBrandId(materialModelPO.getBrandPO().getBid());
		materialModelVO.setMaterialBrandName(materialModelPO.getBrandPO().getBrandName());
		materialModelVO.setMeasurementUnitId(materialModelPO.getMeasurementUnitPO().getId());
		materialModelVO.setMeasurementUnitName(materialModelPO.getMeasurementUnitPO().getName());
		
		return materialModelVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteMaterialModel(MaterialModelVO materialModelVO){
		
		MaterialModelPO materialModelPO = new MaterialModelPO();
		BeanUtil.copyProperties(materialModelVO, materialModelPO);
		materialModelDao.delete(materialModelPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteMaterialModelById(int materialModelId){
		
		materialModelDao.deleteById(materialModelId);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteMaterialModelByIds(List<String> ids){

		for(String id: ids){
			MaterialModelPO materialModelPO = materialModelDao.get(Integer.valueOf(id));
			if(materialModelPO != null){
				materialModelDao.delete(materialModelPO);
			}
		}
	}
}
