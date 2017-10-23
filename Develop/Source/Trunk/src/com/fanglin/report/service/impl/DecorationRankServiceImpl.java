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
import com.fanglin.report.dao.DecorationDesignerDepartmentRankDao;
import com.fanglin.report.dao.DecorationDesignerRankDao;
import com.fanglin.report.dao.DecorationDesignerRegionRankDao;
import com.fanglin.report.po.DecorationDesignerDepartmentRankPO;
import com.fanglin.report.po.DecorationDesignerRankPO;
import com.fanglin.report.po.DecorationDesignerRegionRankPO;
import com.fanglin.report.service.DecorationRankService;
import com.fanglin.report.vo.DecorationDesignerDepartmentRankVO;
import com.fanglin.report.vo.DecorationDesignerRankVO;
import com.fanglin.report.vo.DecorationDesignerRegionRankVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("decorationRankService")
@Transactional(readOnly=true)
public class DecorationRankServiceImpl implements DecorationRankService {
	
	@Autowired
	private DecorationDesignerRankDao decorationDesignerRankDao;
	
	@Autowired
	private DecorationDesignerDepartmentRankDao decorationDesignerDepartmentRankDao;
	
	@Autowired
	private DecorationDesignerRegionRankDao decorationDesignerRegionRankDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public List<DecorationDesignerRankVO> queryDecorationDesignerRankForTop(int top,int company){
		
		List<DecorationDesignerRankPO> decorationDesignerRankPOs = decorationDesignerRankDao.queryDecorationDesignerRankForTop(top,company);
		List<DecorationDesignerRankVO> decorationDesignerRankVOs = new ArrayList<DecorationDesignerRankVO>();
		
		for(DecorationDesignerRankPO decorationDesignerRankPO: decorationDesignerRankPOs){
			DecorationDesignerRankVO decorationDesignerRankVO = new DecorationDesignerRankVO();
			BeanUtil.copyProperties(decorationDesignerRankPO, decorationDesignerRankVO);
			
			decorationDesignerRankVO.setRank(top >= 0 ? (double) Math.round(decorationDesignerRankPO.getRank()) : null);
			decorationDesignerRankVOs.add(decorationDesignerRankVO);
		}
		
		return decorationDesignerRankVOs;
	}
	
	@Override
	public List<TopVO> queryDecorationDesignerRank(int top,int company){
		
		List<DecorationDesignerRankPO> decorationDesignerRankPOs = decorationDesignerRankDao.queryDecorationDesignerRankForTop(top,company);
		List<TopVO> topVOs = new ArrayList<TopVO>();
		
		for(DecorationDesignerRankPO decorationDesignerRankPO: decorationDesignerRankPOs){
			TopVO topVO = new TopVO();
			topVO.setTopName(decorationDesignerRankPO.getDesignerName());
			
			UserPO designer = userDao.queryUserByUserId(decorationDesignerRankPO.getDesignerId());
			if(designer != null){
				topVO.setTopImg(designer.getUserPhoto());
			}else{
				topVO.setTopImg("");
			}
			topVO.setTopType("设计师主材业绩");
			topVO.setTopValue(Float.valueOf(String.valueOf(decorationDesignerRankPO.getRank())));
			topVO.setTopDate(new java.sql.Date(DateUtil.parseDate(decorationDesignerRankPO.getEndTime(), DecorationDesignerRankPO.CURRENT_TIME_FORMAT_STR).getTime()));
			topVO.setTopKind("半年");
			
			topVOs.add(topVO);
		}
		
		return topVOs;
	}

	@Override
	public List<DecorationDesignerDepartmentRankVO> queryDecorationDesignerDepartmentRankForTop(String userId, int top,int company){
		
		List<DecorationDesignerDepartmentRankPO> decorationDesignerDepartmentRankPOs = decorationDesignerDepartmentRankDao.queryDecorationDesignerDepartmentRankForTop(top,company);
		List<DecorationDesignerDepartmentRankVO> decorationDesignerDepartmentRankVOs = new ArrayList<DecorationDesignerDepartmentRankVO>();
		
		for(DecorationDesignerDepartmentRankPO decorationDesignerDepartmentRankPO: decorationDesignerDepartmentRankPOs){
			DecorationDesignerDepartmentRankVO decorationDesignerDepartmentRankVO = new DecorationDesignerDepartmentRankVO();
			BeanUtil.copyProperties(decorationDesignerDepartmentRankPO, decorationDesignerDepartmentRankVO);
			
			decorationDesignerDepartmentRankVO.setRank(null);
			
			decorationDesignerDepartmentRankVOs.add(decorationDesignerDepartmentRankVO);
		}
		
		return decorationDesignerDepartmentRankVOs;
	}
	
	@Override
	public List<TopVO> queryDecorationDesignerDepartmentRank(int top,int company){
		
		List<DecorationDesignerDepartmentRankPO> decorationDesignerDepartmentRankPOs = decorationDesignerDepartmentRankDao.queryDecorationDesignerDepartmentRankForTop(top,company);
		List<TopVO> topVOs = new ArrayList<TopVO>();
		
		for(DecorationDesignerDepartmentRankPO decorationDesignerDepartmentRankPO: decorationDesignerDepartmentRankPOs){
			TopVO topVO = new TopVO();
			topVO.setTopName(decorationDesignerDepartmentRankPO.getDesignerDeptName());
			topVO.setTopImg("");
			topVO.setTopType("设计部门主材业绩");
			topVO.setTopValue(Float.valueOf(String.valueOf(decorationDesignerDepartmentRankPO.getRank())));
			topVO.setTopDate(new java.sql.Date(DateUtil.parseDate(decorationDesignerDepartmentRankPO.getEndTime(), DecorationDesignerRankPO.CURRENT_TIME_FORMAT_STR).getTime()));
			topVO.setTopKind("半年");
			
			topVOs.add(topVO);
		}
		
		return topVOs;
	}

	@Override
	public List<DecorationDesignerRegionRankVO> queryDecorationDesignerRegionRankForTop(String userId, int top,int company){
		
		List<DecorationDesignerRegionRankPO> decorationDesignerRegionRankPOs = decorationDesignerRegionRankDao.queryDecorationDesignerRegionRankForTop(top,company);
		List<DecorationDesignerRegionRankVO> decorationDesignerRegionRankVOs = new ArrayList<DecorationDesignerRegionRankVO>();
		
		for(DecorationDesignerRegionRankPO decorationDesignerRegionRankPO: decorationDesignerRegionRankPOs){
			DecorationDesignerRegionRankVO decorationDesignerRegionRankVO = new DecorationDesignerRegionRankVO();
			BeanUtil.copyProperties(decorationDesignerRegionRankPO, decorationDesignerRegionRankVO);
			
			decorationDesignerRegionRankVO.setRank(null);
			
			decorationDesignerRegionRankVOs.add(decorationDesignerRegionRankVO);
		}
		
		return decorationDesignerRegionRankVOs;
	}
	
	@Override
	public List<TopVO> queryDecorationDesignerRegionRank(int top,int company){
		
		List<DecorationDesignerRegionRankPO> decorationDesignerRegionRankPOs = decorationDesignerRegionRankDao.queryDecorationDesignerRegionRankForTop(top,company);
		List<TopVO> topVOs = new ArrayList<TopVO>();
		
		for(DecorationDesignerRegionRankPO decorationDesignerRegionRankPO: decorationDesignerRegionRankPOs){
			TopVO topVO = new TopVO();
			topVO.setTopName(decorationDesignerRegionRankPO.getDesignerRegionName());
			topVO.setTopImg("");
			topVO.setTopType("设计分区主材业绩");
			topVO.setTopValue(Float.valueOf(String.valueOf(decorationDesignerRegionRankPO.getRank())));
			topVO.setTopDate(new java.sql.Date(DateUtil.parseDate(decorationDesignerRegionRankPO.getEndTime(), DecorationDesignerRankPO.CURRENT_TIME_FORMAT_STR).getTime()));
			topVO.setTopKind("半年");
			
			topVOs.add(topVO);
		}
		
		return topVOs;
	}

	@Override
	public List<String> queryDecorationDesignerForPlaceByUserId(String userId,int company) {
		
		List<String> result = Arrays.asList(new String[]{"0", "0"});
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO != null && "设计师".equals(userPO.getDuty())){
			List<?> _ = decorationDesignerRankDao.queryDecorationDesignerRankForPlaceByDesignerId(userId,company);
			
			if(_.size() > 0){
				
				Object[] infos = (Object[]) _.get(0);
				
				result.set(0, infos[0].toString());
				result.set(1, infos[1].toString());
			}
		}
		
		return result;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateDecorationDesignerRank(String designerId, String designerName, float count, String currentTime,int company) {
		
		DecorationDesignerRankPO decorationDesignerRankPO = decorationDesignerRankDao.queryDecorationDesignerRankForInitByDesignerId(designerId,company);
		if(decorationDesignerRankPO != null){
			decorationDesignerRankPO.setRank(Arith.add(decorationDesignerRankPO.getRank(), count));
		}else{
			decorationDesignerRankPO = new DecorationDesignerRankPO();
			decorationDesignerRankPO.setCreateTime(currentTime);
			decorationDesignerRankPO.setEndTime(currentTime);
			decorationDesignerRankPO.setDesignerId(designerId);
			decorationDesignerRankPO.setDesignerName(designerName);
			decorationDesignerRankPO.setRank(count);
			decorationDesignerRankPO.setCompany(company);
		}
		decorationDesignerRankDao.saveOrUpdate(decorationDesignerRankPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateDecorationDesignerDepartmentRank(String departmentId, String departmentName, float count, String currentTime,int company) {
		
		DecorationDesignerDepartmentRankPO decorationDesignerDepartmentRankPO = decorationDesignerDepartmentRankDao.queryDecorationDesignerDepartmentRankForInitByDeptId(departmentId,company);
		if(decorationDesignerDepartmentRankPO != null){
			decorationDesignerDepartmentRankPO.setRank(Arith.add(decorationDesignerDepartmentRankPO.getRank(), count));
		}else{
			decorationDesignerDepartmentRankPO = new DecorationDesignerDepartmentRankPO();
			decorationDesignerDepartmentRankPO.setCreateTime(currentTime);
			decorationDesignerDepartmentRankPO.setEndTime(currentTime);
			decorationDesignerDepartmentRankPO.setDesignerDeptId(departmentId);
			decorationDesignerDepartmentRankPO.setDesignerDeptName(departmentName);
			decorationDesignerDepartmentRankPO.setRank(count);
			decorationDesignerDepartmentRankPO.setCompany(company);
		}
		decorationDesignerDepartmentRankDao.saveOrUpdate(decorationDesignerDepartmentRankPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateDecorationDesignerRegionRank(String regionId, String regionName, float count, String currentTime,int company) {
		
		DecorationDesignerRegionRankPO decorationDesignerRegionRankPO = decorationDesignerRegionRankDao.queryDecorationDesignerRegionRankForInitByRegionId(regionId,company);
		if(decorationDesignerRegionRankPO != null){
			decorationDesignerRegionRankPO.setRank(Arith.add(decorationDesignerRegionRankPO.getRank(), count));
		}else{
			decorationDesignerRegionRankPO = new DecorationDesignerRegionRankPO();
			decorationDesignerRegionRankPO.setCreateTime(currentTime);
			decorationDesignerRegionRankPO.setEndTime(currentTime);
			decorationDesignerRegionRankPO.setDesignerRegionId(regionId);
			decorationDesignerRegionRankPO.setDesignerRegionName(regionName);
			decorationDesignerRegionRankPO.setRank(count);
			decorationDesignerRegionRankPO.setCompany(company);
		}
		decorationDesignerRegionRankDao.saveOrUpdate(decorationDesignerRegionRankPO);
		
		return 0;
	}

}
