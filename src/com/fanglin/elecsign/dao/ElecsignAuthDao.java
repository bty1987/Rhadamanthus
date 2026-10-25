package com.fanglin.elecsign.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.elecsign.po.ElecsignAuthPO;

public interface ElecsignAuthDao extends Dao<ElecsignAuthPO> {

	public ElecsignAuthPO queryElecsignAuthByCidAndProvider(int cid, short provider);

	public ElecsignAuthPO queryElecsignAuthByToken(String token);

}
