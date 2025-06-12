/**
 * @File Name		: Test.java
 * @Package   	: com.fanglin.swiftpass.airpos
 * @Version		: 1.0
 * @Date			: 2023-6-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.swiftpass.airpos;

import java.util.TreeMap;

import cn.hutool.crypto.SmUtil;
import cn.hutool.crypto.asymmetric.KeyType;

import com.fanglin.swiftpass.enums.ReqMethodEnum;
import com.fanglin.swiftpass.utils.OpenSdk;

public class Test {

	public static void main(String[] args) {

		System.setProperty("https.protocols", "TLSv1.2");

		TreeMap<String, String> params = new TreeMap<String, String>();

		params.put("mchNo", "syfh-fljjzsyxgscqfgs-2"); // 商户号
		params.put("channelType", "SWIFT_PASS"); // 渠道类型
		params.put("signType", "RSA_1_256"); // 签名类型
		String prikey = SmUtil
				.sm2(null, "MFkwEwYHKoZIzj0CAQYIKoEcz1UBgi0DQgAEkTAJ9UQTGUpYkvaqhVvc9P+vd8/TKu16kXkyvXVZNfMIfjqSq94Xj88kz2LigFM6Wly/LPPOUIUB/hDSI2Hl1w==")
				.encryptHex(
						"MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCstJdpJ1HiEp31aOTeM5d0ngrFHWqciaBYXYifBorFjhbTUFfhZrBXXPHrp584oRcHPlaXwobZisAKDqOT2Z+91TWC30JMGFhmjZTkPteZZnb7YJ6TRaAXWHLU9h2bjs+4ZhQ0vkVJinXzu4xPUatbLtt7Hx8AwUuNL+HpckI39IN4X+/97QMP7sv1VVOSqCscvPZ63nIzKIT5HYUBGjHy+G1gGc6T5jwqjTe9WIiLwI6dpZItcthF/eTr3CbSh7rFf786Xo85QDSJoLIfTesTD0rOzFwG8rIHBMQzLxcgQPd4606vVRO2Swf3i7HlDWEdQGNkjdOs1y7E4FYZaca5AgMBAAECggEAYxse6BDQRFM6oeGXtIsWlq06sPK4gyvW/95s0BUI/WUUZB7uz0IGX5vOl9SQ4gZPGLEFMAFJMP0WRq8v32A68syu8HL9sH0n/XGxx2jof/b0wDwpw4lo3Py8qMizJNlHCiJJ5hpp2FHEbiFp2vqawrCY8oZhXCWQHW0kzrnqlgCfY+WdFBZioflPFh8fG6Zukm48gHCpBANn9uKos6MWSTTWUucj3FmzmGOLxfCapBZPILf19k+07gd9TEXQQjVdvLqcBr1QIXCieqOARVVsg3nV21rUWlklLdEvItIJ8Cqd7yXfXtm5f1HMo92q0t7ysBOUFrEgzd98/AcrUBEogQKBgQDt+d2D0vB2oy6pArBBTCltPE8Gh7ZHvh8Mr/0tVg1ygtmVULayq1Q1ZVDzeL8F87T/GyWUwzz6iA1bbDHS9sAcKiL600VXylgvMbITn4clk38Kx0ZOT53DqMlAfy1yh2IZuSYTWSWcMI6MZipSmcKCeonee/cnJ3sJx78ch8JgnQKBgQC5yTCRWaHVLR5Wy1bkBd85NvuIDkupXQvIz6ulHe1eJkGXJlShyxJTijXd7yCqzisfm7gyr2LTP0xT/y5of1QsEhM+67DitRh14f46dPSOi6n/vEKVftKspWsTYveXL5M9MwdoEVhOkGMlpsQcXQiA+iCgZMSxbcc9sCeL26E9zQKBgHWZXlAAc3gNF8fJXlRGUMp8XQj7E6bMWweoCFLZDXgjFWbmJgKRC+H/GUvXxX4peq3+OkoTWRTtGrys8MoxyamhYPvWX5QMmBtqUXfFA8Ib61HmO+YDDhFcXWeT8V+Ba4cOqbQx/5X5oNfcvNloxmg4Kd1aIT6mEfU5UkXFCNc5AoGBAJwxcy2gB5irmAgsZ97IuQTnHs0iB6ZZ3aB0R8BHytoOm7IxvZFQoxWs6uCtO++d6U9noZKrNRCY9NjhfujHs8JhZ+DMUignTGs/FnebAEgfT0r7wZbhysjvQXhJChMHImifUCjD/FQAu/pZnCKkbJPStj9iuKLawlkwke7ZNVQ5AoGBALEmNQSDP5VzNKPfEqxdzBK3E7DopJupQvL9P51bVnbbp0ImbFzq//rEQFq3So0SlN3rDS61poXDTosLU9oGwBOQ+8Ka83S7jUcA1eDDxq3o+NH6MhP7p8F+/b84O6zYuf50QkhXqkgN/7gGY8C+duwyAFkyD3tIL1FGjRbc3Qh9",
						KeyType.PublicKey); // 收银台公钥+商户私钥
		params.put("privateKey", prikey); // 签名私钥
		params.put("publicKey", "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnmpxXjTJVhVXr2rPs9uBfWhAH9cLhBT+KJ5UiLUd0uxrPVec8WCQyZPQnnL0JOgQSBr0rWLcGVxGAdQUt748DfDGn6G/fhdFGJaHwCRfqxM7ymJ/xPm3UQNJeCF1qjDffdRilYwP4FSyiI+T8eAIeSABUTBDx7kkwvkbVi14znZMmDpLx6QNZlAclAZdHemqB/sSSsgfB7yCBJ4K0Fv4uK4qU3EQeOxhXLkitkhPm3uL5O3jgf89B1ZFpiCpI5qyysmPzJuZbvIBfa9OkVeHqINTPCWYCdx3ZD+k9+H5hoXKFDXddvxHptXrPU3APiBcDkgViYbfnFxWjYwaDQDkYQIDAQAB"); // 平台公钥

		System.out.println(params);

		String response = OpenSdk.gateway("/api/openbill/updateMerchantChannelKey", ReqMethodEnum.POST, null, null, params);

		System.out.println(response);

	}

}
