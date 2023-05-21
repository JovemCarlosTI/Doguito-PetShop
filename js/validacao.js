export function valida(input) {
	const tipoDeInput = input.dataset.tipo

	if(validadores[tipoDeInput]) {
		validadores[tipoDeInput](input)
	}

	if(input.validity.valid) {
		input.parentElement.classList.remove(`input-container--invalido`);
		input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ``
	} else {
		input.parentElement.classList.add('input-container--invalido');
		input.parentElement.querySelector('.input-mensagem-erro').innerHTML = showErrorMsg(tipoDeInput, input)
	}
}

const tiposDeErro = [
	'valueMissing',
	'typeMismatch',
	'patternMismatch',
	'customError'
]

const msgErrors = {
	nome: {
		valueMissing: 'O campo nome não pode estar vazio.'
	},
	email: {
		valueMissing: 'O campo de email não pode estar vazio.',
		typeMismatch: 'O email digitado não é válido.'
	},
	senha: {
		valueMissing: 'O campo de senha não pode estar vazio.',
		patternMismatch: 'A senha deve conter entre 6 a 12 caracteres, pelo menos uma letra maiúscula, uma minúscula, um número e não deve conter símbolos!'
	},
	dataNascimento: {
		valueMissing: 'O campo de data de nascimento não pode estar vazio.',
		customError: 'Você deve ser maior que 18 anos de idade para se cadastrar!'
	},
	cpf: {
		valueMissing: 'O campo de cpf não pode estar vazio.',
		customError: 'O CPF digitado não é válido.'
	}
}

const validadores = {
	dataNascimento: input => validaDataNascimento(input),
	cpf: input => validaCPF(input)
}

function showErrorMsg(tipoDeInput, input) {
	let msg = '';

	tiposDeErro.forEach(erro => {
		if(input.validity[erro]) {
			msg = msgErrors[tipoDeInput][erro];
		}
	})

	return msg;
}

const dataNascimento = document.querySelector('#nascimento');

dataNascimento.addEventListener('blur', (event) => {
	validaDataNascimento(event.target)
})

function validaDataNascimento(input) {
	const dataRecebida = new Date(input.value);
	let mensagem = ''

	if (!maiorQue18(dataRecebida)) {
		mensagem = 'Você deve ser maior que 18 anos de idade para se cadastrar!'
	}

	input.setCustomValidity(mensagem)
} 

function maiorQue18(data) {
	const dataAtual = new Date();
	const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate());

	return dataMais18 <= dataAtual;
}

function validaCPF(input) {
	// /\D/g = tudo que não for dígito
	const cpfFormatado = input.value.replace(/\D/g, '');
	let msg = '';

	if(!checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)) {
		msg = 'O CPF digitado não é válido.';
	}

	input.setCustomValidity(msg);
}

function checaCPFRepetido(cpf) {
	const valoresRepetidos = [
		'00000000000',
		'11111111111',
		'22222222222',
		'33333333333',
		'44444444444',
		'55555555555',
		'66666666666',
		'77777777777',
		'88888888888',
		'99999999999'
	]
	let cpfValido = true;

	valoresRepetidos.forEach(valor => {
		if(valor == cpf) {
			cpfValido = false;
		}
	})

	return cpfValido;
}

function checaEstruturaCPF(cpf) {
	const multiplicador = 10;

	return checaDigitoVerificador(cpf, multiplicador)
}

function checaDigitoVerificador(cpf, multiplicador) {
	if (multiplicador > 11) {
		return true;
	}
	
	let multiplicadorInicial = multiplicador;
	let soma = 0;
	const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('')
	const digitoVerificador = cpf.charAt(multiplicador - 1);
	
	for(let contador = 0; multiplicadorInicial > 1; multiplicadorInicial--) {
		soma += cpfSemDigitos[contador] * multiplicadorInicial;
		contador++;
	}

	if (digitoVerificador == confirmaDigito(soma)) {
		return checaDigitoVerificador(cpf, multiplicador + 1);
	}

	return false;
}

function confirmaDigito(soma) {
	return 11 - (soma % 11);
}