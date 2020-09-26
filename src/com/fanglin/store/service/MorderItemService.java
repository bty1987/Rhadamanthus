package com.fanglin.store.service;

import java.util.List;

import com.fanglin.store.vo.MorderItemVO;
import com.fanglin.store.vo.MorderVO;

public interface MorderItemService {

	public List<MorderItemVO> queryMorderItemByOid(MorderVO morderVO);

}
