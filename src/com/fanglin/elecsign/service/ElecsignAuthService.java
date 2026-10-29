package com.fanglin.elecsign.service;

import java.util.List;

import com.fanglin.elecsign.vo.ElecsignAuthVO;

public interface ElecsignAuthService {

	public List<ElecsignAuthVO> queryElecsignAuthByCid(int cid);
}
