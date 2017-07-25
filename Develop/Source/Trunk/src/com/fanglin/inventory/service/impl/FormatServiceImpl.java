package com.fanglin.inventory.service.impl;

import java.util.ArrayList;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.FormatDao;
import com.fanglin.inventory.po.FormatPO;
import com.fanglin.inventory.service.FormatService;
import com.fanglin.inventory.vo.FormatVO;
import com.fanglin.utils.BeanUtil;

@Service("formatService")
@Transactional(readOnly=true)
public class FormatServiceImpl implements FormatService{
	
	@Autowired
	private FormatDao formatDao;
	
	@Override
	public List<FormatVO> queryFormatByGid(FormatVO formatVO) {
		
		List<FormatPO> formatPOs = formatDao.queryFormatByGid(formatVO.getGid());
		List<FormatVO> formatVOs = new ArrayList<FormatVO>();
		
		for(FormatPO formatPO: formatPOs){
			
			formatVO = new FormatVO();
			
			BeanUtil.copyProperties(formatPO, formatVO);
			
			formatVOs.add(formatVO);
		}
		
		return formatVOs;
	}

	@Override
	public List<FormatVO> queryFormatForEnableByGid(FormatVO formatVO) {
		
		List<FormatPO> formatPOs = formatDao.queryFormatByGid(formatVO.getGid());
		List<FormatVO> formatVOs = new ArrayList<FormatVO>();
		
		for(FormatPO formatPO: formatPOs){
			
			formatVO = new FormatVO();
			
			BeanUtil.copyProperties(formatPO, formatVO);
			
			formatPO.setStatus(FormatPO.STATUS_ENABLE_INT);
			
			formatVOs.add(formatVO);
		}
		
		return formatVOs;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addFormat(FormatVO formatVO) throws FLException {
		
		FormatPO formatPO = formatDao.queryFormatByInfo(formatVO.getGid(),formatVO.getInfo());
		
		if(formatPO!=null){
			throw new FLException(260035, "规格已存在");
		}
		
		formatPO = new FormatPO();
		
		BeanUtil.copyProperties(formatVO, formatPO);
		formatPO.setStatus(FormatPO.STATUS_ENABLE_INT);
		
		formatDao.save(formatPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateFormatForStatus(FormatVO formatVO) throws FLException {
		
		FormatPO formatPO = formatDao.get(formatVO.getFid());
		
		if(formatPO == null){
			throw new FLException(260015, "规格不存在");
		}
		
		formatPO.setStatus(formatVO.getStatus());
		
		formatDao.update(formatPO);
		
		return 0;
	}

}
