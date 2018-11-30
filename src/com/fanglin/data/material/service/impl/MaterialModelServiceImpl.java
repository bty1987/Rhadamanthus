package com.fanglin.data.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.BrandDao;
import com.fanglin.communion.dao.CategoryDao;
import com.fanglin.communion.po.BrandPO;
import com.fanglin.communion.po.CategoryPO;
import com.fanglin.communion.po.MeasurementUnitPO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.MaterialModelDao;
import com.fanglin.data.material.service.MaterialModelService;
import com.fanglin.data.material.vo.MaterialModelVO;
import com.fanglin.data.po.MaterialModelPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.right.dao.BrandUserRightDao;
import com.fanglin.right.po.BrandUserRightPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("materialModelService")
@Transactional(readOnly=true)
public class MaterialModelServiceImpl implements MaterialModelService{
	
	public static final int MATERIAL_LIMIT_INT = 10;

	@Autowired
	private MaterialModelDao materialModelDao;
	
	@Autowired
	private BrandDao brandDao;
	
	@Autowired
	private CategoryDao categoryDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private BrandUserRightDao brandUserRightDao;
	
	public void pageMaterialModel(Paging paging, List<Filter> filters, String userId,int company) throws FLException{
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		List<MaterialModelPO> materialModelPOs = new ArrayList<MaterialModelPO>();
		
		BrandUserRightPO brandUserRightPO = brandUserRightDao.queryBrandUserRightByUid(userPO.getUid());
		
		if(brandUserRightPO == null){
			throw new FLException(180020, "无主材型号操作权限");
		}
		
		if(!"".equals(brandUserRightPO.getBrandId())){
			List<Long> brandIDs = new ArrayList<Long>();
			String[] brandIds = brandUserRightPO.getBrandId().split("#");
			for(String id : brandIds){
				brandIDs.add(Long.parseLong(id));
			}
			materialModelPOs = materialModelDao.pageMaterialModelByBrandIds(paging, filters, brandIDs);
		}
		
		List<MaterialModelVO> materialModelVOs = new ArrayList<MaterialModelVO>();
		
		for(MaterialModelPO materialModelPO: materialModelPOs){
			MaterialModelVO materialModelVO = new MaterialModelVO();
			
			BeanUtil.copyProperties(materialModelPO, materialModelVO, Arrays.asList("brand", "measurementUnit"));
			
			BrandPO brandPO = materialModelPO.getBrand();
			CategoryPO categoryPO = brandPO.getCategory();
			
			materialModelVO.setMaterialBrandId(brandPO.getBid());
			materialModelVO.setMaterialBrandName(brandPO.getName());
			materialModelVO.setMeasurementUnitId(materialModelPO.getMeasurementUnit().getId());
			materialModelVO.setMeasurementUnitName(materialModelPO.getMeasurementUnit().getName());
			materialModelVO.setMaterialTypeId(categoryPO.getCid());
			materialModelVO.setMaterialTypeName(categoryPO.getName());
			
			materialModelVOs.add(materialModelVO);
		}
		
		paging.setData(materialModelVOs);
	}
	
	public void pageMaterialModelForAdvance(Paging paging, List<Filter> filters, int company) throws FLException{
		
		List<MaterialModelPO> materialModelPOs = materialModelDao.pageMaterialModel(paging, filters,company);
		
		List<MaterialModelVO> materialModelVOs = new ArrayList<MaterialModelVO>();
		
		for(MaterialModelPO materialModelPO: materialModelPOs){
			MaterialModelVO materialModelVO = new MaterialModelVO();
			
			BeanUtil.copyProperties(materialModelPO, materialModelVO, Arrays.asList("brand", "measurementUnit"));
			
			BrandPO brandPO = materialModelPO.getBrand();
			CategoryPO categoryPO = brandPO.getCategory();
			
			materialModelVO.setMaterialBrandId(brandPO.getBid());
			materialModelVO.setMaterialBrandName(brandPO.getName());
			materialModelVO.setMeasurementUnitId(materialModelPO.getMeasurementUnit().getId());
			materialModelVO.setMeasurementUnitName(materialModelPO.getMeasurementUnit().getName());
			materialModelVO.setMaterialTypeId(categoryPO.getCid());
			materialModelVO.setMaterialTypeName(categoryPO.getName());
			
			materialModelVOs.add(materialModelVO);
		}
		
		paging.setData(materialModelVOs);
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addMaterialModel(MaterialModelVO materialModelVO,int company) throws FLException{
		
		MaterialModelPO materialModelPO = materialModelDao.queryMaterialModelByNoBrand(materialModelVO.getMaterialModelNo(), materialModelVO.getMaterialBrandId());
		
		BrandPO brandPO = brandDao.queryBrandByBid(materialModelVO.getMaterialBrandId());
		
		CategoryPO categoryPO = categoryDao.queryCategoryByCId(brandPO.getCategory().getCid());
		
		if(materialModelPO != null){
			throw new FLException(180002, "型号信息已经存在");
		}
		
		materialModelPO = new MaterialModelPO();
		BeanUtil.copyProperties(materialModelVO, materialModelPO, Arrays.asList("brand", "measurementUnit"));
		
		materialModelPO.setBrand(new BrandPO(materialModelVO.getMaterialBrandId()));
		materialModelPO.setMeasurementUnit(new MeasurementUnitPO(materialModelVO.getMeasurementUnitId()));
		materialModelPO.setCompany(company);
		materialModelPO.setBase(0);
		materialModelPO.setPoint(0);
		materialModelPO.setStatus(MaterialModelPO.TYPE_DISABLE_INT);
		materialModelPO.setMaterialTypeName(categoryPO.getName());
		materialModelPO.setMaterialBrandName(brandPO.getName());
		
		materialModelDao.save(materialModelPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialModel(MaterialModelVO materialModelVO){
		
		MaterialModelPO materialModelPO = materialModelDao.get(materialModelVO.getMmId());
		
		if(materialModelPO != null){
			BeanUtil.copyProperties(materialModelVO, materialModelPO, Arrays.asList("brand", "measurementUnit", "calcType", "base", "point", "status"));
			materialModelPO.setBrand(new BrandPO(materialModelVO.getMaterialBrandId()));
			materialModelPO.setMeasurementUnit(new MeasurementUnitPO(materialModelVO.getMeasurementUnitId()));
			
			materialModelDao.update(materialModelPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialModelForStatus(MaterialModelVO materialModelVO) {
		
		MaterialModelPO materialModelPO = materialModelDao.get(materialModelVO.getMmId());
		
		if(materialModelPO != null){
			
			materialModelPO.setStatus(materialModelVO.getStatus());
			
			materialModelDao.update(materialModelPO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialModelForAdvance(MaterialModelVO materialModelVO) {
		
		MaterialModelPO materialModelPO = materialModelDao.get(materialModelVO.getMmId());
		
		if(materialModelPO != null){
			
			materialModelPO.setCalcType(materialModelVO.getCalcType());
			materialModelPO.setBase(materialModelVO.getBase());
			materialModelPO.setPoint(materialModelVO.getPoint());
			
			materialModelDao.update(materialModelPO);
		}
	}

	@Override
	public List<MaterialModelVO> queryMaterialModel(List<Filter> filters){
		
		List<MaterialModelPO> materialModelPOs = materialModelDao.queryMaterialModel(filters);
		List<MaterialModelVO> materialModelVOs = new ArrayList<MaterialModelVO>();
		
		for(MaterialModelPO materialModelPO: materialModelPOs){
			
			MaterialModelVO materialModelVO = new MaterialModelVO();
			
			BeanUtil.copyProperties(materialModelPO, materialModelVO, Arrays.asList("brand", "measurementUnit"));
			
			materialModelVO.setMaterialBrandId(materialModelPO.getBrand().getBid());
			materialModelVO.setMaterialBrandName(materialModelPO.getBrand().getName());
			materialModelVO.setMeasurementUnitId(materialModelPO.getMeasurementUnit().getId());
			materialModelVO.setMeasurementUnitName(materialModelPO.getMeasurementUnit().getName());
			
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
			
			BeanUtil.copyProperties(materialModelPO, materialModelVO, Arrays.asList("brand", "measurementUnit"));
			
			materialModelVO.setMaterialBrandId(materialModelPO.getBrand().getBid());
			materialModelVO.setMaterialBrandName(materialModelPO.getBrand().getName());
			materialModelVO.setMeasurementUnitId(materialModelPO.getMeasurementUnit().getId());
			materialModelVO.setMeasurementUnitName(materialModelPO.getMeasurementUnit().getName());
			
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
	public MaterialModelVO queryMaterialModelByMmId(MaterialModelVO materialModelVO){
		
		MaterialModelPO materialModelPO = materialModelDao.get(materialModelVO.getMmId());
		
		BeanUtil.copyProperties(materialModelPO, materialModelVO, Arrays.asList("brand", "measurementUnit"));
		
		return materialModelVO;
	}

	@Override
	public MaterialModelVO queryMaterialModelByNo(MaterialModelVO materialModelVO,int company){

		MaterialModelPO materialModelPO = materialModelDao.queryMaterialModelByNo(materialModelVO.getMaterialModelNo(), company);
		BeanUtil.copyProperties(materialModelPO, materialModelVO, Arrays.asList("brand", "measurementUnit"));
		
		return materialModelVO;
	}

	@Override
	public List<MaterialModelVO> queryMaterialModelForAllByName(MaterialModelVO materialModelVO,int company){
		
		List<MaterialModelPO> materialModelPOs = materialModelDao.queryMaterialModelByName(materialModelVO.getMaterialModelName(), MATERIAL_LIMIT_INT,company);
		List<MaterialModelVO> materialModelVOs = new ArrayList<MaterialModelVO>();
		
		for(MaterialModelPO materialModelPO: materialModelPOs){
			
			materialModelVO = new MaterialModelVO();
			
			BeanUtil.copyProperties(materialModelPO, materialModelVO, Arrays.asList("brand", "measurementUnit"));
			
			materialModelVO.setMaterialBrandId(materialModelPO.getBrand().getBid());
			materialModelVO.setMaterialBrandName(materialModelPO.getBrand().getName());
			materialModelVO.setMeasurementUnitId(materialModelPO.getMeasurementUnit().getId());
			materialModelVO.setMeasurementUnitName(materialModelPO.getMeasurementUnit().getName());
			
			materialModelVOs.add(materialModelVO);
		}
		
		return materialModelVOs;
	}
	
	@Override
	public List<MaterialModelVO> queryMaterialModelForAllByNo(MaterialModelVO materialModelVO){
		
		List<MaterialModelPO> materialModelPOs = materialModelDao.queryMaterialModelsByNo(materialModelVO.getMaterialModelNo(), MATERIAL_LIMIT_INT);
		List<MaterialModelVO> materialModelVOs = new ArrayList<MaterialModelVO>();
		
		for(MaterialModelPO materialModelPO: materialModelPOs){
			
			materialModelVO = new MaterialModelVO();
			
			BeanUtil.copyProperties(materialModelPO, materialModelVO, Arrays.asList("brand", "measurementUnit"));
			
			materialModelVO.setMaterialBrandId(materialModelPO.getBrand().getBid());
			materialModelVO.setMaterialBrandName(materialModelPO.getBrand().getName());
			materialModelVO.setMeasurementUnitId(materialModelPO.getMeasurementUnit().getId());
			materialModelVO.setMeasurementUnitName(materialModelPO.getMeasurementUnit().getName());
			
			materialModelVOs.add(materialModelVO);
		}
		
		return materialModelVOs;
	}

	@Override
	public MaterialModelVO queryMaterialModelById(MaterialModelVO materialModelVO){
		
		MaterialModelPO materialModelPO = materialModelDao.get(materialModelVO.getMmId());
		
		BeanUtil.copyProperties(materialModelPO, materialModelVO, Arrays.asList("brand", "measurementUnit"));
		
		materialModelVO.setMaterialBrandId(materialModelPO.getBrand().getBid());
		materialModelVO.setMaterialBrandName(materialModelPO.getBrand().getName());
		materialModelVO.setMeasurementUnitId(materialModelPO.getMeasurementUnit().getId());
		materialModelVO.setMeasurementUnitName(materialModelPO.getMeasurementUnit().getName());
		
		return materialModelVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteMaterialModel(MaterialModelVO materialModelVO){
		
		MaterialModelPO materialModelPO = new MaterialModelPO();
		
		BeanUtil.copyProperties(materialModelVO, materialModelPO, Arrays.asList("brand", "measurementUnit"));
		
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
