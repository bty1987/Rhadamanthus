/**
 * @File Name		: MaterialReportService.java
 * @Package   	: com.fanglin.service.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.report.dao.MaterialDepartmentCountDao;
import com.fanglin.report.dao.MaterialDesignerCountDao;
import com.fanglin.report.dao.MaterialDesignerDepartmentCountDao;
import com.fanglin.report.dao.MaterialDesignerRegionCountDao;
import com.fanglin.report.dao.ZaterialDesignerCountDao;
import com.fanglin.report.dao.ZaterialDesignerDepartmentCountDao;
import com.fanglin.report.dao.ZaterialDesignerRegionCountDao;
import com.fanglin.report.po.MaterialDepartmentCountPO;
import com.fanglin.report.po.MaterialDesignerCountPO;
import com.fanglin.report.po.MaterialDesignerDepartmentCountPO;
import com.fanglin.report.po.MaterialDesignerRegionCountPO;
import com.fanglin.report.po.ZaterialDesignerCountPO;
import com.fanglin.report.po.ZaterialDesignerDepartmentCountPO;
import com.fanglin.report.po.ZaterialDesignerRegionCountPO;
import com.fanglin.report.service.MaterialReportService;
import com.fanglin.report.vo.MaterialDepartmentCountVO;
import com.fanglin.report.vo.MaterialDesignerCountVO;
import com.fanglin.report.vo.MaterialDesignerDepartmentCountVO;
import com.fanglin.report.vo.MaterialDesignerRegionCountVO;
import com.fanglin.report.vo.ZaterialDesignerCountVO;
import com.fanglin.report.vo.ZaterialDesignerDepartmentCountVO;
import com.fanglin.report.vo.ZaterialDesignerRegionCountVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;

@Service("materialReportService")
@Transactional(readOnly=true)
public class MaterialReportServiceImpl implements MaterialReportService {
	
	@Autowired
	private MaterialDepartmentCountDao materialDepartmentCountDao;
	
	@Autowired
	private MaterialDesignerCountDao materialDesignerCountDao;
	
	@Autowired
	private MaterialDesignerDepartmentCountDao materialDesignerDepartmentCountDao;
	
	@Autowired
	private MaterialDesignerRegionCountDao materialDesignerRegionCountDao;
	
	@Autowired
	private ZaterialDesignerCountDao zaterialDesignerCountDao;
	
	@Autowired
	private ZaterialDesignerDepartmentCountDao zaterialDesignerDepartmentCountDao;
	
	@Autowired
	private ZaterialDesignerRegionCountDao zaterialDesignerRegionCountDao;
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateMaterialDepartmentCount(String departmentId, float count, String currentTime) {
		
		MaterialDepartmentCountPO materialDepartmentCountPO = materialDepartmentCountDao.queryMaterialDepartmentCountByDeptIdTime(departmentId, currentTime);
		
		if(materialDepartmentCountPO != null){
			materialDepartmentCountPO.setTotal(Arith.add(materialDepartmentCountPO.getTotal(), count));
		}else{
			materialDepartmentCountPO = new MaterialDepartmentCountPO();
			materialDepartmentCountPO.setCreateTime(currentTime);
			materialDepartmentCountPO.setMaterialDeptId(departmentId);
			materialDepartmentCountPO.setTotal(count);
		}
		
		materialDepartmentCountDao.saveOrUpdate(materialDepartmentCountPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateMaterialDesignerCount(String designerId, String designerName, String departmentId, String departmentName, String regionId, String regionName, float count, String currentTime) {
		
		MaterialDesignerCountPO materialDesignerCountPO = materialDesignerCountDao.queryMaterialDesignerCountByDesignerIdATime(designerId, currentTime);
		
		if(materialDesignerCountPO != null){
			materialDesignerCountPO.setTotal(Arith.add(materialDesignerCountPO.getTotal(), count));
		}else{
			materialDesignerCountPO = new MaterialDesignerCountPO();
			materialDesignerCountPO.setCreateTime(currentTime);
			materialDesignerCountPO.setDesignerId(designerId);
			materialDesignerCountPO.setDesignerName(designerName);
			materialDesignerCountPO.setDesignerDepartmentId(departmentId);
			materialDesignerCountPO.setDesignerDepartmentName(departmentName);
			materialDesignerCountPO.setDesignerRegionId(regionId);
			materialDesignerCountPO.setDesignerRegionName(regionName);
			materialDesignerCountPO.setTotal(count);
		}
		
		materialDesignerCountDao.saveOrUpdate(materialDesignerCountPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateMaterialDesignerDepartmentCount(String departmentId, String departmentName, String regionId, String regionName, float count, String currentTime) {
		
		MaterialDesignerDepartmentCountPO materialDesignerDepartmentCountPO = materialDesignerDepartmentCountDao.queryMaterialDesignerDepartmentCountByDeptIdTime(departmentId, currentTime);
		
		if(materialDesignerDepartmentCountPO != null){
			materialDesignerDepartmentCountPO.setTotal(Arith.add(materialDesignerDepartmentCountPO.getTotal(), count));
		}else{
			materialDesignerDepartmentCountPO = new MaterialDesignerDepartmentCountPO();
			materialDesignerDepartmentCountPO.setCreateTime(currentTime);
			materialDesignerDepartmentCountPO.setDesignerDeptId(departmentId);
			materialDesignerDepartmentCountPO.setDesignerDeptName(departmentName);
			materialDesignerDepartmentCountPO.setDesignerRegionId(regionId);
			materialDesignerDepartmentCountPO.setDesignerRegionName(regionName);
			materialDesignerDepartmentCountPO.setTotal(count);
		}
		
		materialDesignerDepartmentCountDao.saveOrUpdate(materialDesignerDepartmentCountPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateMaterialDesignerRegionCount(String regionId, String regionName, float count, String currentTime) {
		
		MaterialDesignerRegionCountPO materialDesignerRegionCountPO = materialDesignerRegionCountDao.queryMaterialDesignerRegionCountByRegionIdTime(regionId, currentTime);
		
		if(materialDesignerRegionCountPO != null){
			materialDesignerRegionCountPO.setTotal(Arith.add(materialDesignerRegionCountPO.getTotal(), count));
		}else{
			materialDesignerRegionCountPO = new MaterialDesignerRegionCountPO();
			materialDesignerRegionCountPO.setCreateTime(currentTime);
			materialDesignerRegionCountPO.setDesignerRegionId(regionId);
			materialDesignerRegionCountPO.setDesignerRegionName(regionName);
			materialDesignerRegionCountPO.setTotal(count);
		}
		
		materialDesignerRegionCountDao.saveOrUpdate(materialDesignerRegionCountPO);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateZaterialDesignerCount(String designerId, String designerName, String departmentId, String departmentName, String regionId, String regionName, String materialBrand, float count, String currentTime) {
		
		ZaterialDesignerCountPO zaterialDesignerCountPO = zaterialDesignerCountDao.queryZaterialDesignerCountByDesignerIdATime(designerId, currentTime);
		
		if(zaterialDesignerCountPO != null){
			zaterialDesignerCountPO.setTotal(Arith.add(zaterialDesignerCountPO.getTotal(), count));
		}else{
			zaterialDesignerCountPO = new ZaterialDesignerCountPO();
			zaterialDesignerCountPO.setCreateTime(currentTime);
			zaterialDesignerCountPO.setDesignerId(designerId);
			zaterialDesignerCountPO.setDesignerName(designerName);
			zaterialDesignerCountPO.setDesignerDepartmentId(departmentId);
			zaterialDesignerCountPO.setDesignerDepartmentName(departmentName);
			zaterialDesignerCountPO.setDesignerRegionId(regionId);
			zaterialDesignerCountPO.setDesignerRegionName(regionName);
			zaterialDesignerCountPO.setMaterialBrand(materialBrand);
			zaterialDesignerCountPO.setTotal(count);
		}
		
		zaterialDesignerCountDao.saveOrUpdate(zaterialDesignerCountPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateZaterialDesignerDepartmentCount(String departmentId, String departmentName, String regionId, String regionName, String materialBrand, float count, String currentTime) {
		
		ZaterialDesignerDepartmentCountPO zaterialDesignerDepartmentCountPO = zaterialDesignerDepartmentCountDao.queryZaterialDesignerDepartmentCountByDeptIdTime(departmentId, currentTime);
		
		if(zaterialDesignerDepartmentCountPO != null){
			zaterialDesignerDepartmentCountPO.setTotal(Arith.add(zaterialDesignerDepartmentCountPO.getTotal(), count));
		}else{
			zaterialDesignerDepartmentCountPO = new ZaterialDesignerDepartmentCountPO();
			zaterialDesignerDepartmentCountPO.setCreateTime(currentTime);
			zaterialDesignerDepartmentCountPO.setDesignerDeptId(departmentId);
			zaterialDesignerDepartmentCountPO.setDesignerDeptName(departmentName);
			zaterialDesignerDepartmentCountPO.setDesignerRegionId(regionId);
			zaterialDesignerDepartmentCountPO.setDesignerRegionName(regionName);
			zaterialDesignerDepartmentCountPO.setMaterialBrand(materialBrand);
			zaterialDesignerDepartmentCountPO.setTotal(count);
		}
		
		zaterialDesignerDepartmentCountDao.saveOrUpdate(zaterialDesignerDepartmentCountPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateZaterialDesignerRegionCount(String regionId, String regionName, String materialBrand, float count, String currentTime) {
		
		ZaterialDesignerRegionCountPO zaterialDesignerRegionCountPO = zaterialDesignerRegionCountDao.queryZaterialDesignerRegionCountByRegionIdTime(regionId, currentTime);
		
		if(zaterialDesignerRegionCountPO != null){
			zaterialDesignerRegionCountPO.setTotal(Arith.add(zaterialDesignerRegionCountPO.getTotal(), count));
		}else{
			zaterialDesignerRegionCountPO = new ZaterialDesignerRegionCountPO();
			zaterialDesignerRegionCountPO.setCreateTime(currentTime);
			zaterialDesignerRegionCountPO.setDesignerRegionId(regionId);
			zaterialDesignerRegionCountPO.setDesignerRegionName(regionName);
			zaterialDesignerRegionCountPO.setMaterialBrand(materialBrand);
			zaterialDesignerRegionCountPO.setTotal(count);
		}
		
		zaterialDesignerRegionCountDao.saveOrUpdate(zaterialDesignerRegionCountPO);
		
		return 0;
	}

	@Override
	public List<MaterialDepartmentCountVO> reportMaterialDepartmentCount(List<Filter> filters){
		
		List<MaterialDepartmentCountPO> materialDepartmentCountPOs = materialDepartmentCountDao.queryMaterialDepartmentCount(filters);
		List<MaterialDepartmentCountVO> materialDepartmentCountVOs = new ArrayList<MaterialDepartmentCountVO>();
		
		for(MaterialDepartmentCountPO materialDepartmentCountPO: materialDepartmentCountPOs){
			MaterialDepartmentCountVO materialDepartmentCountVO = new MaterialDepartmentCountVO();
			BeanUtil.copyProperties(materialDepartmentCountPO, materialDepartmentCountVO);
			materialDepartmentCountVOs.add(materialDepartmentCountVO);
		}
		
		return materialDepartmentCountVOs;
	}
	
	@Override
	public List<MaterialDesignerCountVO> reportMaterialDesignerCount(List<Filter> filters) {
		
		List<MaterialDesignerCountPO> materialDesignerCountPOs = materialDesignerCountDao.queryMaterialDesignerCount(filters);
		List<MaterialDesignerCountVO> materialDesignerCountVOs = new ArrayList<MaterialDesignerCountVO>();
		
		for(MaterialDesignerCountPO materialDesignerCountPO: materialDesignerCountPOs){
			MaterialDesignerCountVO materialDesignerCountVO = new MaterialDesignerCountVO();
			BeanUtil.copyProperties(materialDesignerCountPO, materialDesignerCountVO);
			
			materialDesignerCountVOs.add(materialDesignerCountVO);
		}
		
		return materialDesignerCountVOs;
	}

	@Override
	public List<MaterialDesignerDepartmentCountVO> reportMaterialDesignerDepartmentCount(List<Filter> filters){
		
		List<MaterialDesignerDepartmentCountPO> materialDesignerDepartmentCountPOs = materialDesignerDepartmentCountDao.queryMaterialDesignerDepartmentCount(filters);
		List<MaterialDesignerDepartmentCountVO> materialDesignerDepartmentCountVOs = new ArrayList<MaterialDesignerDepartmentCountVO>();
		
		for(MaterialDesignerDepartmentCountPO materialDesignerDepartmentCountPO: materialDesignerDepartmentCountPOs){
			MaterialDesignerDepartmentCountVO materialDesignerDepartmentCountVO = new MaterialDesignerDepartmentCountVO();
			BeanUtil.copyProperties(materialDesignerDepartmentCountPO, materialDesignerDepartmentCountVO);
			materialDesignerDepartmentCountVOs.add(materialDesignerDepartmentCountVO);
		}
		
		return materialDesignerDepartmentCountVOs;
	}
	
	@Override
	public List<ZaterialDesignerDepartmentCountVO> reportZaterialDesignerDepartmentCount(List<Filter> filters){
		
		List<ZaterialDesignerDepartmentCountPO> zaterialDesignerDepartmentCountPOs = zaterialDesignerDepartmentCountDao.queryZaterialDesignerDepartmentCount(filters);
		List<ZaterialDesignerDepartmentCountVO> zaterialDesignerDepartmentCountVOs = new ArrayList<ZaterialDesignerDepartmentCountVO>();
		
		for(ZaterialDesignerDepartmentCountPO zaterialDesignerDepartmentCountPO: zaterialDesignerDepartmentCountPOs){
			ZaterialDesignerDepartmentCountVO zaterialDesignerDepartmentCountVO = new ZaterialDesignerDepartmentCountVO();
			BeanUtil.copyProperties(zaterialDesignerDepartmentCountPO, zaterialDesignerDepartmentCountVO);
			zaterialDesignerDepartmentCountVOs.add(zaterialDesignerDepartmentCountVO);
		}
		
		return zaterialDesignerDepartmentCountVOs;
	}
	
	@Override
	public List<ZaterialDesignerCountVO> reportZaterialDesignerCount(List<Filter> filters) {
		
		List<ZaterialDesignerCountPO> zaterialDesignerCountPOs = zaterialDesignerCountDao.queryZaterialDesignerCount(filters);
		List<ZaterialDesignerCountVO> zaterialDesignerCountVOs = new ArrayList<ZaterialDesignerCountVO>();
		
		for(ZaterialDesignerCountPO zaterialDesignerCountPO: zaterialDesignerCountPOs){
			ZaterialDesignerCountVO zaterialDesignerCountVO = new ZaterialDesignerCountVO();
			BeanUtil.copyProperties(zaterialDesignerCountPO, zaterialDesignerCountVO);
			
			zaterialDesignerCountVOs.add(zaterialDesignerCountVO);
		}
		
		return zaterialDesignerCountVOs;
	}

	@Override
	public List<MaterialDesignerRegionCountVO> reportMaterialDesignerRegionCount(List<Filter> filters){
		
		List<MaterialDesignerRegionCountPO> materialDesignerRegionCountPOs = materialDesignerRegionCountDao.queryMaterialDesignerRegionCount(filters);
		List<MaterialDesignerRegionCountVO> materialDesignerRegionCountVOs = new ArrayList<MaterialDesignerRegionCountVO>();
		
		for(MaterialDesignerRegionCountPO materialDesignerRegionCountPO: materialDesignerRegionCountPOs){
			MaterialDesignerRegionCountVO materialDesignerRegionCountVO = new MaterialDesignerRegionCountVO();
			BeanUtil.copyProperties(materialDesignerRegionCountPO, materialDesignerRegionCountVO);
			materialDesignerRegionCountVOs.add(materialDesignerRegionCountVO);
		}
		
		return materialDesignerRegionCountVOs;
	}
	
	@Override
	public List<ZaterialDesignerRegionCountVO> reportZaterialDesignerRegionCount(List<Filter> filters){
		
		List<ZaterialDesignerRegionCountPO> zaterialDesignerRegionCountPOs = zaterialDesignerRegionCountDao.queryZaterialDesignerRegionCount(filters);
		List<ZaterialDesignerRegionCountVO> zaterialDesignerRegionCountVOs = new ArrayList<ZaterialDesignerRegionCountVO>();
		
		for(ZaterialDesignerRegionCountPO zaterialDesignerRegionCountPO: zaterialDesignerRegionCountPOs){
			ZaterialDesignerRegionCountVO zaterialDesignerRegionCountVO = new ZaterialDesignerRegionCountVO();
			BeanUtil.copyProperties(zaterialDesignerRegionCountPO, zaterialDesignerRegionCountVO);
			zaterialDesignerRegionCountVOs.add(zaterialDesignerRegionCountVO);
		}
		
		return zaterialDesignerRegionCountVOs;
	}

	@Override
	public List<MaterialDesignerCountVO> countMaterialDesignerCount(List<Filter> filters) {
		
		List<Object> result = materialDesignerCountDao.countMaterialDesignerCount(filters);
		List<MaterialDesignerCountVO> materialDesignerCountVOs = new ArrayList<MaterialDesignerCountVO>();
		
		for(Object r: result){
			Object[] materialDesignerCount = (Object[]) r;
			
			MaterialDesignerCountVO materialDesignerCountVO = new MaterialDesignerCountVO();
			materialDesignerCountVO.setTotal(Float.valueOf(materialDesignerCount[0].toString()));
			materialDesignerCountVO.setDesignerId(materialDesignerCount[1].toString());
			materialDesignerCountVO.setDesignerName(materialDesignerCount[2].toString());
			
			materialDesignerCountVOs.add(materialDesignerCountVO);
		}
		
		return materialDesignerCountVOs;
	}

	@Override
	public List<MaterialDesignerDepartmentCountVO> countMaterialDesignerDepartmentCount(List<Filter> filters) {
		
		List<Object> result = materialDesignerDepartmentCountDao.countMaterialDesignerDepartmentCount(filters);
		List<MaterialDesignerDepartmentCountVO> materialDesignerDepartmentCountVOs = new ArrayList<MaterialDesignerDepartmentCountVO>();
		
		for(Object r: result){
			Object[] materialDesignerDepartmentCount = (Object[]) r;
			
			MaterialDesignerDepartmentCountVO materialDesignerDepartmentCountVO = new MaterialDesignerDepartmentCountVO();
			materialDesignerDepartmentCountVO.setTotal(Float.valueOf(materialDesignerDepartmentCount[0].toString()));
			materialDesignerDepartmentCountVO.setDesignerDeptId(materialDesignerDepartmentCount[1].toString());
			materialDesignerDepartmentCountVO.setDesignerDeptName(materialDesignerDepartmentCount[2].toString());
			
			materialDesignerDepartmentCountVOs.add(materialDesignerDepartmentCountVO);
		}
		
		return materialDesignerDepartmentCountVOs;
	}
	
	@Override
	public List<MaterialDesignerRegionCountVO> countMaterialDesignerRegionCount(List<Filter> filters) {
		
		List<Object> result = materialDesignerRegionCountDao.countMaterialDesignerRegionCount(filters);
		List<MaterialDesignerRegionCountVO> materialDesignerRegionCountVOs = new ArrayList<MaterialDesignerRegionCountVO>();
		
		for(Object r: result){
			Object[] materialDesignerRegionCount = (Object[]) r;
			
			MaterialDesignerRegionCountVO materialDesignerRegionCountVO = new MaterialDesignerRegionCountVO();
			materialDesignerRegionCountVO.setTotal(Float.valueOf(materialDesignerRegionCount[0].toString()));
			materialDesignerRegionCountVO.setDesignerRegionId(materialDesignerRegionCount[1].toString());
			materialDesignerRegionCountVO.setDesignerRegionName(materialDesignerRegionCount[2].toString());
			
			materialDesignerRegionCountVOs.add(materialDesignerRegionCountVO);
			
		}
		
		return materialDesignerRegionCountVOs;
	}
	
	@Override
	public List<ZaterialDesignerCountVO> countZaterialDesignerCount(List<Filter> filters) {
		
		List<Object> result = zaterialDesignerCountDao.countZaterialDesignerCount(filters);
		List<ZaterialDesignerCountVO> zaterialDesignerCountVOs = new ArrayList<ZaterialDesignerCountVO>();
		
		for(Object r: result){
			Object[] zaterialDesignerCount = (Object[]) r;
			
			ZaterialDesignerCountVO zaterialDesignerCountVO = new ZaterialDesignerCountVO();
			zaterialDesignerCountVO.setTotal(Float.valueOf(zaterialDesignerCount[0].toString()));
			zaterialDesignerCountVO.setDesignerDepartmentId(zaterialDesignerCount[1].toString());
			zaterialDesignerCountVO.setDesignerDepartmentName(zaterialDesignerCount[2].toString());
			
			zaterialDesignerCountVOs.add(zaterialDesignerCountVO);
		}
		
		return zaterialDesignerCountVOs;
	}

	@Override
	public List<ZaterialDesignerDepartmentCountVO> countZaterialDesignerDepartmentCount(List<Filter> filters) {
		
		List<Object> result = zaterialDesignerDepartmentCountDao.countZaterialDesignerDepartmentCount(filters);
		List<ZaterialDesignerDepartmentCountVO> zaterialDesignerDepartmentCountVOs = new ArrayList<ZaterialDesignerDepartmentCountVO>();
		
		for(Object r: result){
			Object[] zaterialDesignerDepartmentCount = (Object[]) r;
			
			ZaterialDesignerDepartmentCountVO zaterialDesignerDepartmentCountVO = new ZaterialDesignerDepartmentCountVO();
			zaterialDesignerDepartmentCountVO.setTotal(Float.valueOf(zaterialDesignerDepartmentCount[0].toString()));
			zaterialDesignerDepartmentCountVO.setDesignerDeptId(zaterialDesignerDepartmentCount[1].toString());
			zaterialDesignerDepartmentCountVO.setDesignerDeptName(zaterialDesignerDepartmentCount[2].toString());

			zaterialDesignerDepartmentCountVOs.add(zaterialDesignerDepartmentCountVO);
		}
		
		return zaterialDesignerDepartmentCountVOs;
	}

	@Override
	public List<ZaterialDesignerRegionCountVO> countZaterialDesignerRegionCount(List<Filter> filters) {
		
		List<Object> result = zaterialDesignerRegionCountDao.countZaterialDesignerRegionCount(filters);
		List<ZaterialDesignerRegionCountVO> zaterialdeDesignerRegionCountVOs = new ArrayList<ZaterialDesignerRegionCountVO>();
		
		for(Object r: result){
			Object[] zaterialDesignerRegionCount = (Object[]) r;
			
			ZaterialDesignerRegionCountVO zaterialDesignerRegionCountVO = new ZaterialDesignerRegionCountVO();
			zaterialDesignerRegionCountVO.setTotal(Float.valueOf(zaterialDesignerRegionCount[0].toString()));
			zaterialDesignerRegionCountVO.setDesignerRegionId(zaterialDesignerRegionCount[1].toString());
			zaterialDesignerRegionCountVO.setDesignerRegionName(zaterialDesignerRegionCount[2].toString());
			
			zaterialdeDesignerRegionCountVOs.add(zaterialDesignerRegionCountVO);
		}
		
		return zaterialdeDesignerRegionCountVOs;
	}

}
