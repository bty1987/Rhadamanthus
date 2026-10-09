package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationFunctionDao;
import com.fanglin.decoration.po.DecorationFunctionPO;
import com.fanglin.decoration.service.DecorationFunctionService;
import com.fanglin.decoration.vo.DecorationFunctionVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("decorationFunctionService")
@Transactional(readOnly = true)
public class DecorationFunctionServiceImpl implements DecorationFunctionService {

	@Autowired
	private DecorationFunctionDao decorationFunctionDao;

	@Override
	public List<DecorationFunctionVO> pageDecorationFunction(Paging paging, List<Filter> filters) {

		List<DecorationFunctionPO> decorationFunctionPOs = decorationFunctionDao.pageDecorationFunction(paging, filters);
		List<DecorationFunctionVO> decorationFunctionVOs = new ArrayList<DecorationFunctionVO>();

		for (DecorationFunctionPO decorationFunctionPO : decorationFunctionPOs) {

			DecorationFunctionVO decorationFunctionVO = new DecorationFunctionVO();
			BeanUtil.copyPropertie(decorationFunctionPO, decorationFunctionVO);

			decorationFunctionVOs.add(decorationFunctionVO);
		}

		return decorationFunctionVOs;
	}

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

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDecorationFunction(DecorationFunctionVO decorationFunctionVO) throws FLException {

		if (decorationFunctionDao.queryDecorationFunctionByName(decorationFunctionVO.getName()).size() > 0) {
			throw new FLException(140105, "装修功能已存在");
		}

		DecorationFunctionPO decorationFunctionPO = new DecorationFunctionPO();

		BeanUtil.copyPropertie(decorationFunctionVO, decorationFunctionPO);

		decorationFunctionDao.save(decorationFunctionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateDecorationFunction(DecorationFunctionVO decorationFunctionVO) throws FLException {

		DecorationFunctionPO decorationFunctionPO = decorationFunctionDao.get(decorationFunctionVO.getDfid());

		if (decorationFunctionPO == null) {
			throw new FLException(140107, "装修功能不存在");
		}

		for (DecorationFunctionPO namePO : decorationFunctionDao.queryDecorationFunctionByName(decorationFunctionVO.getName())) {
			if (namePO.getDfid() != decorationFunctionVO.getDfid().longValue()) {
				throw new FLException(140105, "装修功能已存在");
			}
		}

		BeanUtil.copyPropertie(decorationFunctionVO, decorationFunctionPO, Arrays.asList("dfid"));

		decorationFunctionDao.update(decorationFunctionPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteDecorationFunction(DecorationFunctionVO decorationFunctionVO) throws FLException {

		if (decorationFunctionDao.countDecorationFunctionRightByDfid(decorationFunctionVO.getDfid()) > 0) {
			throw new FLException(140106, "装修功能已被引用,不可删除");
		}

		decorationFunctionDao.deleteById(decorationFunctionVO.getDfid());

		return 0;
	}

}
