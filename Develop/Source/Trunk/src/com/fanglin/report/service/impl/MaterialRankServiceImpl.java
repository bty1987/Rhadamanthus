package com.fanglin.report.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.vo.TopVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.report.dao.MaterialDesignerDepartmentRankDao;
import com.fanglin.report.dao.MaterialDesignerRankDao;
import com.fanglin.report.dao.MaterialDesignerRegionRankDao;
import com.fanglin.report.dao.ZaterialDesignerDepartmentRankDao;
import com.fanglin.report.dao.ZaterialDesignerRankDao;
import com.fanglin.report.dao.ZaterialDesignerRegionRankDao;
import com.fanglin.report.po.MaterialDesignerDepartmentRankPO;
import com.fanglin.report.po.MaterialDesignerRankPO;
import com.fanglin.report.po.MaterialDesignerRegionRankPO;
import com.fanglin.report.po.ZaterialDesignerDepartmentRankPO;
import com.fanglin.report.po.ZaterialDesignerRankPO;
import com.fanglin.report.po.ZaterialDesignerRegionRankPO;
import com.fanglin.report.service.MaterialRankService;
import com.fanglin.report.vo.MaterialDesignerDepartmentRankVO;
import com.fanglin.report.vo.MaterialDesignerRankVO;
import com.fanglin.report.vo.MaterialDesignerRegionRankVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("materialRankService")
@Transactional(readOnly=true)
public class MaterialRankServiceImpl implements MaterialRankService {
	
	@Autowired
	private MaterialDesignerRankDao materialDesignerRankDao;
	
	@Autowired
	private MaterialDesignerDepartmentRankDao materialDesignerDepartmentRankDao;
	
	@Autowired
	private MaterialDesignerRegionRankDao materialDesignerRegionRankDao;
	
	@Autowired
	private ZaterialDesignerRankDao zaterialDesignerRankDao;
	
	@Autowired
	private ZaterialDesignerDepartmentRankDao zaterialDesignerDepartmentRankDao;
	
	@Autowired
	private ZaterialDesignerRegionRankDao zaterialDesignerRegionRankDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public List<MaterialDesignerRankVO> queryMaterialDesignerRank() {
	
		return null;
	}

	@Override
	public List<MaterialDesignerRankVO> queryMaterialDesignerRankForTop(int top,int company){
		
		List<MaterialDesignerRankPO> materialDesignerRankPOs = materialDesignerRankDao.queryMaterialDesignerRankForTop(top,company);
		List<MaterialDesignerRankVO> materialDesignerRankVOs = new ArrayList<MaterialDesignerRankVO>();
		
		for(MaterialDesignerRankPO materialDesignerRankPO: materialDesignerRankPOs){
			MaterialDesignerRankVO materialDesignerRankVO = new MaterialDesignerRankVO();
			BeanUtil.copyProperties(materialDesignerRankPO, materialDesignerRankVO);
			
			materialDesignerRankVO.setRank(top >= 0 ? (double) Math.round(materialDesignerRankPO.getRank()) : null);
			
			materialDesignerRankVOs.add(materialDesignerRankVO);
		}
		
		return materialDesignerRankVOs;
	}
	
	@Override
	public List<TopVO> queryMaterialDesignerRank(int top,int company){
		
		List<MaterialDesignerRankPO> materialDesignerRankPOs = materialDesignerRankDao.queryMaterialDesignerRankForTop(top,company);
		List<TopVO> topVOs = new ArrayList<TopVO>();
		
		for(MaterialDesignerRankPO materialDesignerRankPO: materialDesignerRankPOs){
			TopVO topVO = new TopVO();
			topVO.setTopName(materialDesignerRankPO.getDesignerName());
			
			UserPO designer = userDao.queryUserByUserId(materialDesignerRankPO.getDesignerId());
			if(designer != null){
				topVO.setTopImg(designer.getUserPhoto());
			}else{
				topVO.setTopImg("");
			}
			topVO.setTopType("设计师主材业绩");
			topVO.setTopValue(Float.valueOf(String.valueOf(materialDesignerRankPO.getRank())));
			topVO.setTopDate(new java.sql.Date(DateUtil.parseDate(materialDesignerRankPO.getEndTime(), MaterialDesignerRankPO.CURRENT_TIME_FORMAT_STR).getTime()));
			topVO.setTopKind("半年");
			
			topVOs.add(topVO);
		}
		
		return topVOs;
	}

	@Override
	public List<MaterialDesignerDepartmentRankVO> queryMaterialDesignerDepartmentRankForTop(String userId, int top,int company){
		
		List<MaterialDesignerDepartmentRankPO> materialDesignerDepartmentRankPOs = materialDesignerDepartmentRankDao.queryMaterialDesignerDepartmentRankForTop(top,company);
		List<MaterialDesignerDepartmentRankVO> materialDesignerDepartmentRankVOs = new ArrayList<MaterialDesignerDepartmentRankVO>();
		
		for(MaterialDesignerDepartmentRankPO materialDesignerDepartmentRankPO: materialDesignerDepartmentRankPOs){
			MaterialDesignerDepartmentRankVO materialDesignerDepartmentRankVO = new MaterialDesignerDepartmentRankVO();
			BeanUtil.copyProperties(materialDesignerDepartmentRankPO, materialDesignerDepartmentRankVO);
			
			materialDesignerDepartmentRankVO.setRank(null);
			
			materialDesignerDepartmentRankVOs.add(materialDesignerDepartmentRankVO);
		}
		
		return materialDesignerDepartmentRankVOs;
	}
	
	@Override
	public List<TopVO> queryMaterialDesignerDepartmentRank(int top,int company){
		
		List<MaterialDesignerDepartmentRankPO> materialDesignerDepartmentRankPOs = materialDesignerDepartmentRankDao.queryMaterialDesignerDepartmentRankForTop(top,company);
		List<TopVO> topVOs = new ArrayList<TopVO>();
		
		for(MaterialDesignerDepartmentRankPO materialDesignerDepartmentRankPO: materialDesignerDepartmentRankPOs){
			TopVO topVO = new TopVO();
			topVO.setTopName(materialDesignerDepartmentRankPO.getDesignerDeptName());
			topVO.setTopImg("");
			topVO.setTopType("设计部门主材业绩");
			topVO.setTopValue(Float.valueOf(String.valueOf(materialDesignerDepartmentRankPO.getRank())));
			topVO.setTopDate(new java.sql.Date(DateUtil.parseDate(materialDesignerDepartmentRankPO.getEndTime(), MaterialDesignerRankPO.CURRENT_TIME_FORMAT_STR).getTime()));
			topVO.setTopKind("半年");
			
			topVOs.add(topVO);
		}
		
		return topVOs;
	}

	@Override
	public List<MaterialDesignerRegionRankVO> queryMaterialDesignerRegionRankForTop(String userId, int top,int company){
		
		List<MaterialDesignerRegionRankPO> materialDesignerRegionRankPOs = materialDesignerRegionRankDao.queryMaterialDesignerRegionRankForTop(10,company);
		List<MaterialDesignerRegionRankVO> materialDesignerRegionRankVOs = new ArrayList<MaterialDesignerRegionRankVO>();
		
		for(MaterialDesignerRegionRankPO materialDesignerRegionRankPO: materialDesignerRegionRankPOs){
			MaterialDesignerRegionRankVO materialDesignerRegionRankVO = new MaterialDesignerRegionRankVO();
			BeanUtil.copyProperties(materialDesignerRegionRankPO, materialDesignerRegionRankVO);
			
			materialDesignerRegionRankVO.setRank(null);
			
			materialDesignerRegionRankVOs.add(materialDesignerRegionRankVO);
		}
		
		return materialDesignerRegionRankVOs;
	}
	
	@Override
	public List<TopVO> queryMaterialDesignerRegionRank(int top,int company){
		
		List<MaterialDesignerRegionRankPO> materialDesignerRegionRankPOs = materialDesignerRegionRankDao.queryMaterialDesignerRegionRankForTop(top,company);
		List<TopVO> topVOs = new ArrayList<TopVO>();
		
		for(MaterialDesignerRegionRankPO materialDesignerRegionRankPO: materialDesignerRegionRankPOs){
			TopVO topVO = new TopVO();
			topVO.setTopName(materialDesignerRegionRankPO.getDesignerRegionName());
			topVO.setTopImg("");
			topVO.setTopType("设计分区主材业绩");
			topVO.setTopValue(Float.valueOf(String.valueOf(materialDesignerRegionRankPO.getRank())));
			topVO.setTopDate(new java.sql.Date(DateUtil.parseDate(materialDesignerRegionRankPO.getEndTime(), MaterialDesignerRankPO.CURRENT_TIME_FORMAT_STR).getTime()));
			topVO.setTopKind("半年");
			
			topVOs.add(topVO);
		}
		
		return topVOs;
	}

	@Override
	public List<String> queryMaterialDesignerRankForPlaceByUserId(String userId,int company) {
		
		List<String> result = Arrays.asList(new String[]{"0", "0"});
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO != null && "设计师".equals(userPO.getDuty())){
			List<?> _ = materialDesignerRankDao.queryMaterialDesignerRankForPlaceByDesignerId(userId,company);
			
			if(_.size() > 0){
				
				Object[] infos = (Object[]) _.get(0);
				
				result.set(0, infos[0].toString());
				result.set(1, infos[1].toString());
			}
		}
		
		return result;
	}

	@Override
	public List<TopVO> queryZaterialDesignerRank(int top,int company){
		
		List<ZaterialDesignerRankPO> zaterialDesignerRankPOs = zaterialDesignerRankDao.queryZaterialDesignerRankForTop(top,company);
		List<TopVO> topVOs = new ArrayList<TopVO>();
		
		for(ZaterialDesignerRankPO zaterialDesignerRankPO: zaterialDesignerRankPOs){
			TopVO topVO = new TopVO();
			topVO.setTopName(zaterialDesignerRankPO.getDesignerName());
			
			UserPO designer = userDao.queryUserByUserId(zaterialDesignerRankPO.getDesignerId());
			if(designer != null){
				topVO.setTopImg(designer.getUserPhoto());
			}else{
				topVO.setTopImg("");
			}
			
			topVO.setTopType("设计师正林业绩");
			topVO.setTopValue(Float.valueOf(String.valueOf(zaterialDesignerRankPO.getRank())));
			topVO.setTopDate(new java.sql.Date(DateUtil.parseDate(zaterialDesignerRankPO.getEndTime(), MaterialDesignerRankPO.CURRENT_TIME_FORMAT_STR).getTime()));
			topVO.setTopKind("半年");
			
			topVOs.add(topVO);
		}
		
		return topVOs;
	}
	
	@Override
	public List<String> queryZaterialDesignerRankForPlaceByUserId(String userId,int company) {

		List<String> result = Arrays.asList(new String[]{"0", "0"});
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO != null && "设计师".equals(userPO.getDuty())){
			List<?> _ = zaterialDesignerRankDao.queryZaterialDesignerRankForPlaceByDesignerId(userId,company);
			
			if(_.size() > 0){
				
				Object[] infos = (Object[]) _.get(0);
				
				result.set(0, infos[0].toString());
				result.set(1, infos[1].toString());
			}
		}
		
		return result;
	}

	@Override
	public List<TopVO> queryZaterialDesignerDepartmentRank(int top,int company){
		
		List<ZaterialDesignerDepartmentRankPO> zaterialDesignerDepartmentRankPOs = zaterialDesignerDepartmentRankDao.queryZaterialDesignerDepartmentRankForTop(top,company);
		List<TopVO> topVOs = new ArrayList<TopVO>();
		
		for(ZaterialDesignerDepartmentRankPO zaterialDesignerDepartmentRankPO: zaterialDesignerDepartmentRankPOs){
			TopVO topVO = new TopVO();
			topVO.setTopName(zaterialDesignerDepartmentRankPO.getDesignerDeptName());
			topVO.setTopImg("");
			topVO.setTopType("设计部门正林业绩");
			topVO.setTopValue(Float.valueOf(String.valueOf(zaterialDesignerDepartmentRankPO.getRank())));
			topVO.setTopDate(new java.sql.Date(DateUtil.parseDate(zaterialDesignerDepartmentRankPO.getEndTime(), MaterialDesignerRankPO.CURRENT_TIME_FORMAT_STR).getTime()));
			topVO.setTopKind("半年");
			
			topVOs.add(topVO);
		}
		
		return topVOs;
	}

	@Override
	public List<TopVO> queryZaterialDesignerRegionRank(int top,int company){
		List<ZaterialDesignerRegionRankPO> zaterialDesignerRegionRankPOs = zaterialDesignerRegionRankDao.queryZaterialDesignerRegionRankForTop(10,company);
		List<TopVO> topVOs = new ArrayList<TopVO>();
		
		for(ZaterialDesignerRegionRankPO zaterialDesignerRegionRankPO: zaterialDesignerRegionRankPOs){
			TopVO topVO = new TopVO();
			topVO.setTopName(zaterialDesignerRegionRankPO.getDesignerRegionName());
			topVO.setTopImg("");
			topVO.setTopType("设计分区正林业绩");
			topVO.setTopValue(Float.valueOf(String.valueOf(zaterialDesignerRegionRankPO.getRank())));
			topVO.setTopDate(new java.sql.Date(DateUtil.parseDate(zaterialDesignerRegionRankPO.getEndTime(), MaterialDesignerRankPO.CURRENT_TIME_FORMAT_STR).getTime()));
			topVO.setTopKind("半年");
			
			topVOs.add(topVO);
		}
		
		return topVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateMaterialDesignerRank(String designerId, String designerName, float count, String currentTime,int company) {
		
		MaterialDesignerRankPO materialDesignerRankPO = materialDesignerRankDao.queryMaterialDesignerRankByDesignerIdInit(designerId, company);
		if(materialDesignerRankPO != null){
			materialDesignerRankPO.setRank(Arith.add(materialDesignerRankPO.getRank(), count));
		}else{
			materialDesignerRankPO = new MaterialDesignerRankPO();
			materialDesignerRankPO.setCreateTime(currentTime);
			materialDesignerRankPO.setEndTime(currentTime);
			materialDesignerRankPO.setDesignerId(designerId);
			materialDesignerRankPO.setDesignerName(designerName);
			materialDesignerRankPO.setRank(count);
			materialDesignerRankPO.setCompany(company);
		}
		materialDesignerRankDao.saveOrUpdate(materialDesignerRankPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateMaterialDesignerDepartmentRank(String departmentId, String departmentName, float count, String currentTime,int company) {
		
		MaterialDesignerDepartmentRankPO materialDesignerDepartmentRankPO = materialDesignerDepartmentRankDao.queryMaterialDesignerDepartmentRankByDeptIdInit(departmentId, company);
		if(materialDesignerDepartmentRankPO != null){
			materialDesignerDepartmentRankPO.setRank(Arith.add(materialDesignerDepartmentRankPO.getRank(), count));
		}else{
			materialDesignerDepartmentRankPO = new MaterialDesignerDepartmentRankPO();
			materialDesignerDepartmentRankPO.setCreateTime(currentTime);
			materialDesignerDepartmentRankPO.setEndTime(currentTime);
			materialDesignerDepartmentRankPO.setDesignerDeptId(departmentId);
			materialDesignerDepartmentRankPO.setDesignerDeptName(departmentName);
			materialDesignerDepartmentRankPO.setRank(count);
			materialDesignerDepartmentRankPO.setCompany(company);
		}
		materialDesignerDepartmentRankDao.saveOrUpdate(materialDesignerDepartmentRankPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateMaterialDesignerRegionRank(String regionId, String regionName, float count, String currentTime,int company) {
		
		MaterialDesignerRegionRankPO materialDesignerRegionRankPO = materialDesignerRegionRankDao.queryMaterialDesignerRegionRankByRegionIdInit(regionId, company);
		if(materialDesignerRegionRankPO != null){
			materialDesignerRegionRankPO.setRank(Arith.add(materialDesignerRegionRankPO.getRank(), count));
		}else{
			materialDesignerRegionRankPO = new MaterialDesignerRegionRankPO();
			materialDesignerRegionRankPO.setCreateTime(currentTime);
			materialDesignerRegionRankPO.setEndTime(currentTime);
			materialDesignerRegionRankPO.setDesignerRegionId(regionId);
			materialDesignerRegionRankPO.setDesignerRegionName(regionName);
			materialDesignerRegionRankPO.setRank(count);
			materialDesignerRegionRankPO.setCompany(company);
		}
		materialDesignerRegionRankDao.saveOrUpdate(materialDesignerRegionRankPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateZaterialDesignerRank(String designerId, String designerName, float count, String currentTime,int company) {
		
		ZaterialDesignerRankPO zaterialDesignerRankPO = zaterialDesignerRankDao.queryZaterialDesignerRankByDesignerIdInit(designerId, company);
		if(zaterialDesignerRankPO != null){
			zaterialDesignerRankPO.setRank(Arith.add(zaterialDesignerRankPO.getRank(), count));
		}else{
			zaterialDesignerRankPO = new ZaterialDesignerRankPO();
			zaterialDesignerRankPO.setCreateTime(currentTime);
			zaterialDesignerRankPO.setEndTime(currentTime);
			zaterialDesignerRankPO.setDesignerId(designerId);
			zaterialDesignerRankPO.setDesignerName(designerName);
			zaterialDesignerRankPO.setRank(count);
			zaterialDesignerRankPO.setCompany(company);
		}
		zaterialDesignerRankDao.saveOrUpdate(zaterialDesignerRankPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateZaterialDesignerDepartmentRank(String departmentId, String departmentName, float count, String currentTime,int company) {

		ZaterialDesignerDepartmentRankPO zaterialDesignerDepartmentRankPO = zaterialDesignerDepartmentRankDao.queryZaterialDesignerDepartmentRankByDeptIdInit(departmentId, company);
		if(zaterialDesignerDepartmentRankPO != null){
			zaterialDesignerDepartmentRankPO.setRank(Arith.add(zaterialDesignerDepartmentRankPO.getRank(), count));
		}else{
			zaterialDesignerDepartmentRankPO = new ZaterialDesignerDepartmentRankPO();
			zaterialDesignerDepartmentRankPO.setCreateTime(currentTime);
			zaterialDesignerDepartmentRankPO.setEndTime(currentTime);
			zaterialDesignerDepartmentRankPO.setDesignerDeptId(departmentId);
			zaterialDesignerDepartmentRankPO.setDesignerDeptName(departmentName);
			zaterialDesignerDepartmentRankPO.setRank(count);
			zaterialDesignerDepartmentRankPO.setCompany(company);
		}
		zaterialDesignerDepartmentRankDao.saveOrUpdate(zaterialDesignerDepartmentRankPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateZaterialDesignerRegionRank(String regionId, String regionName, float count, String currentTime,int company) {

		
		ZaterialDesignerRegionRankPO zaterialDesignerRegionRankPO = zaterialDesignerRegionRankDao.queryZaterialDesignerRegionRankByRegionIdInit(regionId, company);
		if(zaterialDesignerRegionRankPO != null){
			zaterialDesignerRegionRankPO.setRank(Arith.add(zaterialDesignerRegionRankPO.getRank(), count));
		}else{
			zaterialDesignerRegionRankPO = new ZaterialDesignerRegionRankPO();
			zaterialDesignerRegionRankPO.setCreateTime(currentTime);
			zaterialDesignerRegionRankPO.setEndTime(currentTime);
			zaterialDesignerRegionRankPO.setDesignerRegionId(regionId);
			zaterialDesignerRegionRankPO.setDesignerRegionName(regionName);
			zaterialDesignerRegionRankPO.setRank(count);
			zaterialDesignerRegionRankPO.setCompany(company);
		}
		zaterialDesignerRegionRankDao.saveOrUpdate(zaterialDesignerRegionRankPO);
		
		return 0;
	}
	
}
