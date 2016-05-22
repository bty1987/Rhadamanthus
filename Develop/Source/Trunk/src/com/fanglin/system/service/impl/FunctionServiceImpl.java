package com.fanglin.system.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.system.dao.FunctionDao;
import com.fanglin.system.po.FunctionPO;
import com.fanglin.system.service.FunctionService;
import com.fanglin.system.vo.FunctionVO;
import com.fanglin.utils.BeanUtil;

@Service("functionService")
@Transactional(readOnly = true)
public class FunctionServiceImpl implements FunctionService {

	@Autowired
	private FunctionDao functionDao;

	@Override
	public List<FunctionVO> queryFunctionByModuleId(FunctionVO functionVO){
		
		List<FunctionPO> functionPOs = functionDao.queryFuctionByModuleId(functionVO.getModule().getModuleId());
		List<FunctionVO> functionVOs = new ArrayList<FunctionVO>();
		
		for(FunctionPO functionPO: functionPOs){
			FunctionVO _functionVO = new FunctionVO();
			BeanUtil.copyProperties(functionPO, _functionVO, Arrays.asList("module"));
			
			functionVOs.add(_functionVO);
		}
		
		return functionVOs;
	}
	
}
