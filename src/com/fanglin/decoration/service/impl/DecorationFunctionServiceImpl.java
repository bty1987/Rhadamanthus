package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.decoration.dao.DecorationFunctionDao;
import com.fanglin.decoration.po.DecorationFunctionPO;
import com.fanglin.decoration.service.DecorationFunctionService;
import com.fanglin.decoration.vo.DecorationFunctionVO;
import com.fanglin.utils.BeanUtil;

@Service("decorationFunctionService")
@Transactional(readOnly = true)
public class DecorationFunctionServiceImpl implements DecorationFunctionService {

	@Autowired
	private DecorationFunctionDao decorationFunctionDao;

	@Override
	public List<DecorationFunctionVO> queryDecorationFunction(DecorationFunctionVO decorationFunctionVO) {

		List<DecorationFunctionPO> decorationFunctionPOs = decorationFunctionDao.queryDecorationFunction(decorationFunctionVO.getType());
		List<DecorationFunctionVO> decorationFunctionVOs = new ArrayList<DecorationFunctionVO>();

		for (DecorationFunctionPO decorationFunctionPO : decorationFunctionPOs) {

			decorationFunctionVO = new DecorationFunctionVO();
			BeanUtil.copyPropertie(decorationFunctionPO, decorationFunctionVO);

			decorationFunctionVOs.add(decorationFunctionVO);

		}

		return decorationFunctionVOs;
	}

	@Override
	public List<DecorationFunctionVO> queryDecorationFunctionByName(DecorationFunctionVO decorationFunctionVO) {

		List<DecorationFunctionPO> decorationFunctionPOs = decorationFunctionDao.queryDecorationFunctionByName(decorationFunctionVO.getName());
		List<DecorationFunctionVO> decorationFunctionVOs = new ArrayList<DecorationFunctionVO>();

		for (DecorationFunctionPO decorationFunctionPO : decorationFunctionPOs) {

			decorationFunctionVO = new DecorationFunctionVO();
			BeanUtil.copyPropertie(decorationFunctionPO, decorationFunctionVO);

			decorationFunctionVOs.add(decorationFunctionVO);

		}

		return decorationFunctionVOs;
	}

}
