package com.fanglin.data.common.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.DrawLineGroupDao;
import com.fanglin.data.common.service.DrawLineGroupService;
import com.fanglin.data.common.vo.DrawLineGroupVO;
import com.fanglin.data.po.DrawLineGroupPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("drawLineGroupService")
@Transactional(readOnly = true)
public class DrawLineGroupServiceImpl  implements DrawLineGroupService{
	
	@Autowired
	private   DrawLineGroupDao    drawLineGroupDao ;
	
	@Override
	public List<DrawLineGroupVO> pageDrawLineGroup(Paging paging, List<Filter> filters, int company) {
		
		List<DrawLineGroupPO> drawLineGroupPOs = drawLineGroupDao.pageDrawLineGroup(paging, filters, company);
		
		List<DrawLineGroupVO> drawLineGroupVOs = new ArrayList<DrawLineGroupVO>();
		
		for(DrawLineGroupPO drawLineGroupPO:drawLineGroupPOs){
			
			DrawLineGroupVO drawLineGroupVO = new DrawLineGroupVO();
			
			BeanUtil.copyProperties(drawLineGroupPO, drawLineGroupVO);
			
			drawLineGroupVOs.add(drawLineGroupVO);
			
		}
	
		paging.setData(drawLineGroupVOs);
		
		return drawLineGroupVOs;
		
	}
	
	@Override
	public List<DrawLineGroupVO> queryDrawLineGroup(int company) {
		
		List<DrawLineGroupPO> drawLineGroupPOs = drawLineGroupDao.queryDrawLineGroup(company);
		
		List<DrawLineGroupVO> drawLineGroupVOs = new ArrayList<DrawLineGroupVO>();
		
		for(DrawLineGroupPO drawLineGroupPO: drawLineGroupPOs){
			
			DrawLineGroupVO drawLineGroupVO = new DrawLineGroupVO();
			
			BeanUtil.copyProperties(drawLineGroupPO, drawLineGroupVO);
			
			drawLineGroupVOs.add(drawLineGroupVO);
		}
		
		return drawLineGroupVOs;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void saveDrawLineGroup(DrawLineGroupVO drawLineGroupVO,int company) throws FLException {
		
		DrawLineGroupPO drawLineGroupPo = drawLineGroupDao.queryDrawLineGroupByName(drawLineGroupVO.getName(), company);
			
			if (drawLineGroupPo != null ){
				throw new FLException(130009, "放线小组已存在");
			}
			
			DrawLineGroupPO  drawLineGroupPO = new  DrawLineGroupPO();
			drawLineGroupPO.setName(drawLineGroupVO.getName());
			drawLineGroupPO.setContent(drawLineGroupVO.getContent());
			drawLineGroupPO.setStatus(DrawLineGroupPO.STATUS_ENABLE_INT);
			drawLineGroupPO.setCompany(company);
	
			drawLineGroupDao.save(drawLineGroupPO);
			
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateDrawLineGroup(DrawLineGroupVO drawLineGroupVO, int company)throws FLException {
		
		DrawLineGroupPO  drawLineGroupPOs = drawLineGroupDao.queryDrawLineGroupById(drawLineGroupVO.getGid());
		
		DrawLineGroupPO  DrawLineGroupName =drawLineGroupDao.queryDrawLineGroupByName(drawLineGroupVO.getName(), company);
		
		if(drawLineGroupPOs == null){
			throw new FLException(130008, "放线小组不存在");
		}
		
		if(DrawLineGroupName != null ){
			throw new FLException(130009, "放线小组已存在");
		}
		
		drawLineGroupPOs.setName(drawLineGroupVO.getName());
		
		drawLineGroupPOs.setContent(drawLineGroupVO.getContent());
		
		drawLineGroupDao.update(drawLineGroupPOs);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateDrawLineGroupForStatus(DrawLineGroupVO drawLineGroupVO) throws FLException {
		
		DrawLineGroupPO  drawLineGroupPOs = drawLineGroupDao.queryDrawLineGroupById(drawLineGroupVO.getGid());
		
		if(drawLineGroupPOs == null){
			throw new FLException(130008, "放线小组不存在");
		}
		
		drawLineGroupPOs.setStatus(drawLineGroupVO.getStatus());
		
		drawLineGroupDao.update(drawLineGroupPOs);
		
	}
}
